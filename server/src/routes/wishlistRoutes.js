import { Router } from 'express';
import { getWishlist, toggleWishlist, clearWishlist } from '../controllers/wishlistController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getWishlist);
router.post('/:productId', protect, toggleWishlist);
router.delete('/:productId', protect, toggleWishlist);
router.delete('/', protect, clearWishlist);

export default router;
