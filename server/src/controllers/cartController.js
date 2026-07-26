import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import ErrorResponse from '../utils/errorResponse.js';

const getCartQuery = (req) => {
  if (req.user) return { user: req.user.id };
  return { sessionId: req.headers['x-session-id'] || req.query.sessionId };
};

export const getCart = async (req, res, next) => {
  try {
    const query = getCartQuery(req);
    let cart = await Cart.findOne(query).populate('items.product', 'name slug images price stock colors sizes');

    if (!cart) {
      cart = await Cart.create({ ...query, items: [] });
    }

    let couponDiscount = 0;
    if (cart.couponCode) {
      const coupon = await Coupon.findOne({ code: cart.couponCode, isActive: true });
      if (coupon) {
        let subtotal = 0;
        for (const item of cart.items) {
          if (item.product) {
            subtotal += item.product.price * item.quantity;
          }
        }
        if (coupon.discountType === 'percentage') {
          couponDiscount = Math.min((subtotal * coupon.discountValue) / 100, coupon.maxDiscount || Infinity);
        } else {
          couponDiscount = Math.min(coupon.discountValue, subtotal);
        }
      }
    }

    let subtotal = 0;
    for (const item of cart.items) {
      if (item.product) {
        subtotal += item.product.price * item.quantity;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        ...cart.toObject(),
        subtotal,
        couponDiscount,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, color, size, sessionId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    if (product.stock < quantity) {
      return next(new ErrorResponse('Insufficient stock', 400));
    }

    const query = getCartQuery(req);
    if (!query.user && sessionId) query.sessionId = sessionId;

    let cart = await Cart.findOne(query);

    if (!cart) {
      cart = await Cart.create({ ...query, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.color === color && item.size === size
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, color, size });
    }

    await cart.save();

    cart = await Cart.findById(cart._id).populate('items.product', 'name slug images price stock colors sizes');

    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const query = getCartQuery(req);

    const cart = await Cart.findOne(query);
    if (!cart) {
      return next(new ErrorResponse('Cart not found', 404));
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return next(new ErrorResponse('Cart item not found', 404));
    }

    if (quantity <= 0) {
      item.deleteOne();
    } else {
      item.quantity = quantity;
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name slug images price stock');
    res.status(200).json({ success: true, data: updatedCart });
  } catch (err) {
    next(err);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const query = getCartQuery(req);

    const cart = await Cart.findOne(query);
    if (!cart) {
      return next(new ErrorResponse('Cart not found', 404));
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name slug images price stock');
    res.status(200).json({ success: true, data: updatedCart });
  } catch (err) {
    next(err);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const query = getCartQuery(req);
    const cart = await Cart.findOne(query);
    if (cart) {
      cart.items = [];
      cart.couponCode = undefined;
      await cart.save();
    }

    res.status(200).json({ success: true, data: cart || { items: [] } });
  } catch (err) {
    next(err);
  }
};

export const applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return next(new ErrorResponse('Invalid coupon code', 400));
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return next(new ErrorResponse('Coupon has expired', 400));
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return next(new ErrorResponse('Coupon usage limit reached', 400));
    }

    const query = getCartQuery(req);
    const cart = await Cart.findOne(query);
    if (!cart || cart.items.length === 0) {
      return next(new ErrorResponse('Cart is empty', 400));
    }

    let subtotal = 0;
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (product) subtotal += product.price * item.quantity;
    }

    if (subtotal < coupon.minPurchase) {
      return next(new ErrorResponse(`Minimum purchase of $${coupon.minPurchase} required`, 400));
    }

    cart.couponCode = coupon.code;
    await cart.save();

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.min((subtotal * coupon.discountValue) / 100, coupon.maxDiscount || Infinity);
    } else {
      discount = Math.min(coupon.discountValue, subtotal);
    }

    res.status(200).json({ success: true, data: { code: coupon.code, discount, discountType: coupon.discountType } });
  } catch (err) {
    next(err);
  }
};

export const removeCoupon = async (req, res, next) => {
  try {
    const query = getCartQuery(req);
    const cart = await Cart.findOne(query);
    if (cart) {
      cart.couponCode = undefined;
      await cart.save();
    }
    res.status(200).json({ success: true, message: 'Coupon removed' });
  } catch (err) {
    next(err);
  }
};
