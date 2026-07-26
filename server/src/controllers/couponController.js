import Coupon from '../models/Coupon.js';
import ErrorResponse from '../utils/errorResponse.js';

export const getCoupons = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const coupons = await Coupon.find()
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Coupon.countDocuments();

    res.status(200).json({
      success: true,
      data: coupons,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
};

export const getCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return next(new ErrorResponse('Coupon not found', 404));
    }
    res.status(200).json({ success: true, data: coupon });
  } catch (err) {
    next(err);
  }
};

export const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (err) {
    next(err);
  }
};

export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!coupon) {
      return next(new ErrorResponse('Coupon not found', 404));
    }
    res.status(200).json({ success: true, data: coupon });
  } catch (err) {
    next(err);
  }
};

export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return next(new ErrorResponse('Coupon not found', 404));
    }
    res.status(200).json({ success: true, message: 'Coupon deleted' });
  } catch (err) {
    next(err);
  }
};

export const validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
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

    if (subtotal && subtotal < coupon.minPurchase) {
      return next(new ErrorResponse(`Minimum purchase of $${coupon.minPurchase} required`, 400));
    }

    let discount = 0;
    if (subtotal) {
      if (coupon.discountType === 'percentage') {
        discount = Math.min((subtotal * coupon.discountValue) / 100, coupon.maxDiscount || Infinity);
      } else {
        discount = Math.min(coupon.discountValue, subtotal);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discount,
        description: coupon.description,
      },
    });
  } catch (err) {
    next(err);
  }
};
