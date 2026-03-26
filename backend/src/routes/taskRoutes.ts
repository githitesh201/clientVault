import { Router } from 'express';
import { createTask, listTasks, updateTaskStatus } from '../controllers/taskController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authGuard } from '../middleware/auth.js';
import { permit } from '../middleware/roles.js';

const router = Router();

router.use(asyncHandler(authGuard));
router.get('/', asyncHandler(listTasks));
router.post('/', asyncHandler(permit('admin', 'manager')), asyncHandler(createTask));
router.patch('/:id/status', asyncHandler(permit('admin', 'manager', 'staff')), asyncHandler(updateTaskStatus));

export default router;
