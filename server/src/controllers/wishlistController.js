import Wishlist from '../models/Wishlist.js';
import ErrorResponse from '../utils/errorResponse.js';

export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate(
      'products',
      'name slug price images compareAtPrice averageRating numReviews'
    );

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }

    res.status(200).json({ success: true, data: wishlist });
  } catch (err) {
    next(err);
  }
};

export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [productId] });
      return res.status(200).json({ success: true, data: wishlist, action: 'added' });
    }

    const index = wishlist.products.indexOf(productId);
    if (index > -1) {
      wishlist.products.splice(index, 1);
      await wishlist.save();
      return res.status(200).json({ success: true, data: wishlist, action: 'removed' });
    }

    wishlist.products.push(productId);
    await wishlist.save();

    res.status(200).json({ success: true, data: wishlist, action: 'added' });
  } catch (err) {
    next(err);
  }
};

export const clearWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (wishlist) {
      wishlist.products = [];
      await wishlist.save();
    }
    res.status(200).json({ success: true, data: wishlist || { products: [] } });
  } catch (err) {
    next(err);
  }
};
