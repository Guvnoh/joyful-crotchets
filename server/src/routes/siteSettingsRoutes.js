import { Router } from 'express';
import { getSettings, updateSetting, bulkUpdateSettings } from '../controllers/siteSettingsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getSettings);
router.put('/', protect, authorize('admin'), updateSetting);
router.put('/bulk', protect, authorize('admin'), bulkUpdateSettings);

export default router;
