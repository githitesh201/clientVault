import { Router } from 'express';
import { createProject, listProjects, updateProjectStatus } from '../controllers/projectController.js';
import { authGuard } from '../middleware/auth.js';
import { permit } from '../middleware/roles.js';

const router = Router();

router.use(authGuard);
router.get('/', listProjects);
router.post('/', permit('admin', 'manager'), createProject);
router.patch('/:id/status', permit('admin', 'manager'), updateProjectStatus);

export default router;
