import { Router } from 'express';
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  getReviewsAdmin,
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/product/:productId', getReviews);
router.get('/admin/all', protect, authorize('admin'), getReviewsAdmin);

router.post('/:productId', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;
