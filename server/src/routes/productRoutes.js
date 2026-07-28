import { Router } from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
  getRelatedProducts,
  uploadProductImages,
} from '../controllers/productController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

router.get('/featured', getFeaturedProducts);
router.get('/best-sellers', getBestSellers);
router.get('/new-arrivals', getNewArrivals);

router.get('/', optionalAuth, getProducts);
router.get('/:id', getProduct);
router.get('/slug/:slug', (req, res, next) => {
  req.params.id = req.params.slug;
  return getProduct(req, res, next);
});
router.get('/:id/related', getRelatedProducts);

router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);
router.post('/:id/images', protect, authorize('admin'), upload.array('images', 10), uploadProductImages);

export default router;
