import { Router } from 'express';
import { createClient, listClients } from '../controllers/clientController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authGuard } from '../middleware/auth.js';

const router = Router();

router.use(asyncHandler(authGuard));
router.get('/', asyncHandler(listClients));
router.post('/', asyncHandler(createClient));

export default router;
