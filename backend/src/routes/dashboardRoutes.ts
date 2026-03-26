import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authGuard } from '../middleware/auth.js';

const router = Router();

router.use(asyncHandler(authGuard));
router.get('/stats', asyncHandler(getDashboardStats));

export default router;
