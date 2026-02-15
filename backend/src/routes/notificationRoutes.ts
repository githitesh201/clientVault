import { Router } from 'express';
import { listNotifications, markNotificationRead } from '../controllers/notificationController.js';
import { authGuard } from '../middleware/auth.js';

const router = Router();

router.use(authGuard);
router.get('/', listNotifications);
router.patch('/:id/read', markNotificationRead);

export default router;
