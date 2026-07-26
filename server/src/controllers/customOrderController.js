import CustomOrder from '../models/CustomOrder.js';
import ErrorResponse from '../utils/errorResponse.js';

export const createCustomOrder = async (req, res, next) => {
  try {
    const orderData = { ...req.body };
    if (req.user) {
      orderData.user = req.user.id;
    }

    const customOrder = await CustomOrder.create(orderData);
    res.status(201).json({ success: true, data: customOrder });
  } catch (err) {
    next(err);
  }
};

export const getMyCustomOrders = async (req, res, next) => {
  try {
    const customOrders = await CustomOrder.find({ user: req.user.id })
      .sort('-createdAt')
      .lean();
    res.status(200).json({ success: true, data: customOrders });
  } catch (err) {
    next(err);
  }
};

export const getAllCustomOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};
    if (status) query.status = status;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const customOrders = await CustomOrder.find(query)
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await CustomOrder.countDocuments(query);

    res.status(200).json({
      success: true,
      data: customOrders,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
};

export const updateCustomOrderStatus = async (req, res, next) => {
  try {
    const { status, quotedPrice, adminNotes, note } = req.body;

    const customOrder = await CustomOrder.findById(req.params.id);
    if (!customOrder) {
      return next(new ErrorResponse('Custom order not found', 404));
    }

    customOrder.status = status;
    if (quotedPrice !== undefined) customOrder.quotedPrice = quotedPrice;
    if (adminNotes !== undefined) customOrder.adminNotes = adminNotes;

    customOrder.timeline.push({
      status,
      date: new Date(),
      note: note || `Status updated to ${status}`,
    });

    await customOrder.save();
    res.status(200).json({ success: true, data: customOrder });
  } catch (err) {
    next(err);
  }
};
