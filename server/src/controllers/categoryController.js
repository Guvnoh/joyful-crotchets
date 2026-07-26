import Category from '../models/Category.js';
import ErrorResponse from '../utils/errorResponse.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('productCount')
      .sort('sortOrder name')
      .lean();
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

export const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).populate('productCount');
    if (!category) {
      return next(new ErrorResponse('Category not found', 404));
    }
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).populate('productCount');
    if (!category) {
      return next(new ErrorResponse('Category not found', 404));
    }
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return next(new ErrorResponse('Category not found', 404));
    }
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return next(new ErrorResponse('Category not found', 404));
    }
    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};
