import { Router } from 'express';
import { listAuditLogs, listUsers } from '../controllers/adminController.js';
import { authGuard } from '../middleware/auth.js';
import { permit } from '../middleware/roles.js';

const router = Router();

router.use(authGuard, permit('admin'));
router.get('/users', listUsers);
router.get('/audit-logs', listAuditLogs);

export default router;
