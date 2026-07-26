import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import ErrorResponse from '../utils/errorResponse.js';

export const getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, sort = '-createdAt' } = req.query;

    const query = {};
    if (status) query.status = status;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.id })
      .populate('user', 'name email')
      .populate('items.product', 'name slug images');

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to view this order', 403));
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, billingAddress, paymentMethod, couponCode, notes } = req.body;

    if (!items || items.length === 0) {
      return next(new ErrorResponse('No order items provided', 400));
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return next(new ErrorResponse(`Product not found: ${item.product}`, 404));
      }
      if (product.stock < item.quantity) {
        return next(new ErrorResponse(`Insufficient stock for ${product.name}`, 400));
      }

      let itemPrice = product.price;
      if (item.size) {
        const sizeOption = product.sizes.find((s) => s.name === item.size);
        if (sizeOption) itemPrice = sizeOption.price;
      }

      let customizationPrice = 0;
      if (item.customization && item.customization.additionalPrice) {
        customizationPrice = item.customization.additionalPrice;
      }

      const itemTotal = (itemPrice + customizationPrice) * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: itemPrice,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        image: product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url,
        customization: item.customization,
      });

      product.stock -= item.quantity;
      product.sold += item.quantity;
      await product.save();
    }

    const shippingCost = subtotal >= 75 ? 0 : 8.99;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    let discount = 0;

    if (couponCode) {
      const Coupon = (await import('../models/Coupon.js')).default;
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
        if (coupon.discountType === 'percentage') {
          discount = Math.min((subtotal * coupon.discountValue) / 100, coupon.maxDiscount || Infinity);
        } else {
          discount = Math.min(coupon.discountValue, subtotal);
        }
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    const total = Math.round((subtotal + shippingCost + tax - discount) * 100) / 100;

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      discount,
      total,
      couponCode,
      notes,
    });

    const cartQuery = req.user.id ? { user: req.user.id } : { sessionId: req.body.sessionId };
    await Cart.findOneAndDelete(cartQuery);

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber, note } = req.body;

    const order = await Order.findOne({ orderNumber: req.params.id });
    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (status === 'shipped') order.shippedAt = new Date();
    if (status === 'delivered') order.deliveredAt = new Date();

    order.timeline.push({ status, date: new Date(), note: note || `Status updated to ${status}` });

    if (status === 'cancelled' || status === 'refunded') {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          product.sold = Math.max(0, product.sold - item.quantity);
          await product.save();
        }
      }
    }

    await order.save();
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.id });
    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    if (order.user.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to cancel this order', 403));
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return next(new ErrorResponse('Order cannot be cancelled at this stage', 400));
    }

    order.status = 'cancelled';
    order.timeline.push({ status: 'cancelled', date: new Date(), note: req.body.reason || 'Cancelled by customer' });

    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        product.sold = Math.max(0, product.sold - item.quantity);
        await product.save();
      }
    }

    await order.save();
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { user: req.user.id };
    if (status) query.status = status;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(query)
      .populate('items.product', 'name slug images')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
};

export const getOrderStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $nin: ['cancelled', 'refunded'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(5)
      .lean();

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingOrders,
        deliveredOrders,
        recentOrders,
        ordersByStatus,
      },
    });
  } catch (err) {
    next(err);
  }
};
