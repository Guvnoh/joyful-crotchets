import { Router } from 'express';
import { getDashboardStats, getSalesChart, getInventoryAlerts } from '../controllers/statsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', protect, authorize('admin'), getDashboardStats);
router.get('/sales-chart', protect, authorize('admin'), getSalesChart);
router.get('/inventory-alerts', protect, authorize('admin'), getInventoryAlerts);

export default router;
