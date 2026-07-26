import FAQ from '../models/FAQ.js';
import ErrorResponse from '../utils/errorResponse.js';

export const getFAQs = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;

    const faqs = await FAQ.find(query).sort('sortOrder createdAt').lean();
    res.status(200).json({ success: true, data: faqs });
  } catch (err) {
    next(err);
  }
};

export const getFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return next(new ErrorResponse('FAQ not found', 404));
    }
    res.status(200).json({ success: true, data: faq });
  } catch (err) {
    next(err);
  }
};

export const createFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json({ success: true, data: faq });
  } catch (err) {
    next(err);
  }
};

export const updateFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!faq) {
      return next(new ErrorResponse('FAQ not found', 404));
    }
    res.status(200).json({ success: true, data: faq });
  } catch (err) {
    next(err);
  }
};

export const deleteFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) {
      return next(new ErrorResponse('FAQ not found', 404));
    }
    res.status(200).json({ success: true, message: 'FAQ deleted' });
  } catch (err) {
    next(err);
  }
};
