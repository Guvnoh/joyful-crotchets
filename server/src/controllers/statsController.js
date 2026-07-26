import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    const revenueResult = await Order.aggregate([
      { $match: { status: { $nin: ['cancelled', 'refunded'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(10)
      .lean();

    const revenueByMonth = await Order.aggregate([
      { $match: { status: { $nin: ['cancelled', 'refunded'] } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]);

    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          slug: '$product.slug',
          images: '$product.images',
          totalSold: 1,
          totalRevenue: 1,
        },
      },
    ]);

    const orderStatusBreakdown = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const lowStockProducts = await Product.find({ stock: { $lte: 5 }, isActive: true })
      .select('name slug stock images')
      .sort('stock')
      .limit(10)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalProducts,
        totalCustomers,
        totalRevenue,
        recentOrders,
        revenueByMonth,
        topProducts,
        orderStatusBreakdown,
        lowStockProducts,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getSalesChart = async (req, res, next) => {
  try {
    const { period = 'daily', startDate, endDate } = req.query;

    const matchStage = { status: { $nin: ['cancelled', 'refunded'] } };
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    let groupId;
    if (period === 'daily') {
      groupId = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' },
      };
    } else if (period === 'weekly') {
      groupId = {
        year: { $year: '$createdAt' },
        week: { $week: '$createdAt' },
      };
    } else {
      groupId = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
      };
    }

    const salesData = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupId,
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
          avgOrderValue: { $avg: '$total' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    res.status(200).json({ success: true, data: salesData });
  } catch (err) {
    next(err);
  }
};

export const getInventoryAlerts = async (req, res, next) => {
  try {
    const threshold = parseInt(req.query.threshold, 10) || 5;

    const lowStockProducts = await Product.find({
      stock: { $lte: threshold },
      isActive: true,
    })
      .select('name slug stock images sku')
      .sort('stock')
      .lean();

    const outOfStock = await Product.find({ stock: 0, isActive: true })
      .select('name slug stock images sku')
      .lean();

    res.status(200).json({
      success: true,
      data: {
        lowStockProducts,
        outOfStock,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStock.length,
      },
    });
  } catch (err) {
    next(err);
  }
};
