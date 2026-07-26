import { Router } from 'express';
import { runSeed } from '../controllers/seedController.js';

const router = Router();

router.get('/', runSeed);

export default router;
