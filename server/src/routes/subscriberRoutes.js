import { Router } from 'express';
import { subscribe, unsubscribe, getSubscribers } from '../controllers/subscriberController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);
router.get('/', protect, authorize('admin'), getSubscribers);

export default router;
