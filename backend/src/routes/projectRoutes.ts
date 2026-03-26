import { Router } from 'express';
import { createProject, listProjects, updateProjectStatus } from '../controllers/projectController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authGuard } from '../middleware/auth.js';
import { permit } from '../middleware/roles.js';

const router = Router();

router.use(asyncHandler(authGuard));
router.get('/', asyncHandler(listProjects));
router.post('/', asyncHandler(permit('admin', 'manager')), asyncHandler(createProject));
router.patch('/:id/status', asyncHandler(permit('admin', 'manager')), asyncHandler(updateProjectStatus));

export default router;
