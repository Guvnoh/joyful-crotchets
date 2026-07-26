import { Router } from 'express';
import {
  createCustomOrder,
  getMyCustomOrders,
  getAllCustomOrders,
  updateCustomOrderStatus,
} from '../controllers/customOrderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/', createCustomOrder);
router.get('/my', protect, getMyCustomOrders);
router.get('/', protect, authorize('admin'), getAllCustomOrders);
router.put('/:id/status', protect, authorize('admin'), updateCustomOrderStatus);

export default router;
