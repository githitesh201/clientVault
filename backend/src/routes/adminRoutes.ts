import { Router } from 'express';
import { listAuditLogs, listUsers } from '../controllers/adminController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authGuard } from '../middleware/auth.js';
import { permit } from '../middleware/roles.js';

const router = Router();

router.use(asyncHandler(authGuard), asyncHandler(permit('admin')));
router.get('/users', asyncHandler(listUsers));
router.get('/audit-logs', asyncHandler(listAuditLogs));

export default router;
