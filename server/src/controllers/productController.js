import Product from '../models/Product.js';
import ErrorResponse from '../utils/errorResponse.js';
import cloudinary from '../config/cloudinary.js';

export const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      search,
      sort = '-createdAt',
      isPublished,
      isFeatured,
      isBestSeller,
      isNewArrival,
      inStock,
      tags,
    } = req.query;

    const isAdmin = req.user && req.user.role === 'admin';
    const query = { isActive: true };

    if (isAdmin && isPublished !== undefined) {
      query.isPublished = isPublished === 'true';
    } else {
      query.isPublished = true;
    }

    if (category) query.category = category;
    if (isFeatured) query.isFeatured = isFeatured === 'true';
    if (isBestSeller) query.isBestSeller = isBestSeller === 'true';
    if (isNewArrival) query.isNewArrival = isNewArrival === 'true';
    if (inStock === 'true') query.stock = { $gt: 0 };
    if (tags) query.tags = { $in: tags.split(',') };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    let sortOption = {};
    if (search) {
      sortOption = { score: { $meta: 'textScore' }, ...parseSortString(sort) };
    } else {
      sortOption = parseSortString(sort);
    }

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
};

function parseSortString(sort) {
  const sortObj = {};
  sort.split(',').forEach((field) => {
    const trimmed = field.trim();
    if (trimmed.startsWith('-')) {
      sortObj[trimmed.substring(1)] = -1;
    } else {
      sortObj[trimmed] = 1;
    }
  });
  return sortObj;
}

export const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id)
        .populate('category', 'name slug')
        .populate({ path: 'reviews', match: { isApproved: true }, populate: { path: 'user', select: 'name avatar' } });
    } else {
      product = await Product.findOne({ slug: id, isActive: true })
        .populate('category', 'name slug')
        .populate({ path: 'reviews', match: { isApproved: true }, populate: { path: 'user', select: 'name avatar' } });
    }

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        if (img.publicId) {
          try {
            await cloudinary.uploader.destroy(img.publicId);
          } catch (err) {
            // Continue deleting other images even if one fails
          }
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};

export const getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 8;
    const products = await Product.find({ isFeatured: true, isActive: true, isPublished: true })
      .populate('category', 'name slug')
      .sort('-createdAt')
      .limit(limit)
      .lean();
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

export const getBestSellers = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 8;
    const products = await Product.find({ isActive: true, isPublished: true })
      .populate('category', 'name slug')
      .sort('-sold')
      .limit(limit)
      .lean();
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

export const getNewArrivals = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 8;
    const products = await Product.find({ isNewArrival: true, isActive: true, isPublished: true })
      .populate('category', 'name slug')
      .sort('-createdAt')
      .limit(limit)
      .lean();
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

export const getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    const limit = parseInt(req.query.limit, 10) || 4;
    const products = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
      isPublished: true,
    })
      .populate('category', 'name slug')
      .limit(limit)
      .lean();

    res.status(200).json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

export const uploadProductImages = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    if (!req.files || req.files.length === 0) {
      return next(new ErrorResponse('Please upload at least one image', 400));
    }

    const uploadedImages = [];
    for (const file of req.files) {
      const b64 = file.buffer.toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'joyful-crotchets/products',
        transformation: [{ width: 800, height: 800, crop: 'limit' }],
      });

      uploadedImages.push({
        url: result.secure_url,
        publicId: result.public_id,
        alt: req.body.alt || product.name,
        isPrimary: product.images.length === 0 && uploadedImages.length === 0,
      });
    }

    product.images.push(...uploadedImages);
    await product.save();

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};
