import { Router } from 'express';
import { getMedia } from '../controllers/mediaController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, authorize('admin'), getMedia);

export default router;
