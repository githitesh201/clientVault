import { Router } from 'express';
import { createTask, listTasks, updateTaskStatus } from '../controllers/taskController.js';
import { authGuard } from '../middleware/auth.js';
import { permit } from '../middleware/roles.js';

const router = Router();

router.use(authGuard);
router.get('/', listTasks);
router.post('/', permit('admin', 'manager'), createTask);
router.patch('/:id/status', permit('admin', 'manager', 'staff'), updateTaskStatus);

export default router;
