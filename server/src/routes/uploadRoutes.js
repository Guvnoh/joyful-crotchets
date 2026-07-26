import { Router } from 'express';
import { uploadImage, uploadMultipleImages, deleteImage } from '../controllers/uploadController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

router.post('/image', protect, authorize('admin'), upload.single('image'), uploadImage);
router.post('/images', protect, authorize('admin'), upload.array('images', 10), uploadMultipleImages);
router.delete('/image', protect, authorize('admin'), deleteImage);

export default router;
