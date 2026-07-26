import Testimonial from '../models/Testimonial.js';
import ErrorResponse from '../utils/errorResponse.js';

export const getTestimonials = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const testimonials = await Testimonial.find({ isPublished: true })
      .sort('sortOrder -createdAt')
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Testimonial.countDocuments({ isPublished: true });

    res.status(200).json({
      success: true,
      data: testimonials,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
};

export const getFeaturedTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ isFeatured: true, isPublished: true })
      .sort('sortOrder')
      .limit(6)
      .lean();
    res.status(200).json({ success: true, data: testimonials });
  } catch (err) {
    next(err);
  }
};

export const getTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return next(new ErrorResponse('Testimonial not found', 404));
    }
    res.status(200).json({ success: true, data: testimonial });
  } catch (err) {
    next(err);
  }
};

export const createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: testimonial });
  } catch (err) {
    next(err);
  }
};

export const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!testimonial) {
      return next(new ErrorResponse('Testimonial not found', 404));
    }
    res.status(200).json({ success: true, data: testimonial });
  } catch (err) {
    next(err);
  }
};

export const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return next(new ErrorResponse('Testimonial not found', 404));
    }
    res.status(200).json({ success: true, message: 'Testimonial deleted' });
  } catch (err) {
    next(err);
  }
};
