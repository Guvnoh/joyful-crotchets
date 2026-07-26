import { Router } from 'express';
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getMyOrders,
  getOrderStats,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/my-orders', protect, getMyOrders);
router.get('/stats', protect, authorize('admin'), getOrderStats);

router.get('/', protect, authorize('admin'), getOrders);
router.get('/:id', protect, getOrder);
router.post('/', protect, createOrder);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);
router.post('/:id/cancel', protect, cancelOrder);

export default router;
