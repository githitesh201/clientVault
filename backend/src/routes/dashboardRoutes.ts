import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { authGuard } from '../middleware/auth.js';

const router = Router();

router.use(authGuard);
router.get('/stats', getDashboardStats);

export default router;
