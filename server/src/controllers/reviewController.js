import Review from '../models/Review.js';
import Order from '../models/Order.js';
import ErrorResponse from '../utils/errorResponse.js';

export const getReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const reviews = await Review.find({ product: req.params.productId, isApproved: true })
      .populate('user', 'name avatar')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Review.countDocuments({ product: req.params.productId, isApproved: true });

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
};

export const createReview = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    req.body.product = req.params.productId;

    const existingReview = await Review.findOne({ user: req.user.id, product: req.params.productId });
    if (existingReview) {
      return next(new ErrorResponse('You have already reviewed this product', 400));
    }

    const order = await Order.findOne({
      user: req.user.id,
      'items.product': req.params.productId,
      status: { $in: ['delivered', 'completed'] },
    });
    if (order) {
      req.body.isVerifiedPurchase = true;
    }

    const review = await Review.create(req.body);
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);
    if (!review) {
      return next(new ErrorResponse('Review not found', 404));
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to update this review', 403));
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('user', 'name avatar');

    await Review.calculateAverageRating(review.product);

    res.status(200).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return next(new ErrorResponse('Review not found', 404));
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to delete this review', 403));
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);
    await Review.calculateAverageRating(productId);

    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
};

export const getReviewsAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, isApproved } = req.query;
    const query = {};
    if (isApproved !== undefined) query.isApproved = isApproved === 'true';

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const reviews = await Review.find(query)
      .populate('user', 'name email')
      .populate('product', 'name')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Review.countDocuments(query);

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
};
