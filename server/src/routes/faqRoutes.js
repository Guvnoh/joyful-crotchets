import { Router } from 'express';
import { getFAQs, getFAQ, createFAQ, updateFAQ, deleteFAQ } from '../controllers/faqController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getFAQs);
router.get('/:id', getFAQ);

router.post('/', protect, authorize('admin'), createFAQ);
router.put('/:id', protect, authorize('admin'), updateFAQ);
router.delete('/:id', protect, authorize('admin'), deleteFAQ);

export default router;
