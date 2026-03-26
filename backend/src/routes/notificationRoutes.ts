import { Router } from 'express';
import { listNotifications, markNotificationRead } from '../controllers/notificationController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authGuard } from '../middleware/auth.js';

const router = Router();

router.use(asyncHandler(authGuard));
router.get('/', asyncHandler(listNotifications));
router.patch('/:id/read', asyncHandler(markNotificationRead));

export default router;
