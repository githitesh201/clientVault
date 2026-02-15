import { Router } from 'express';
import { createClient, listClients } from '../controllers/clientController.js';
import { authGuard } from '../middleware/auth.js';

const router = Router();

router.use(authGuard);
router.get('/', listClients);
router.post('/', createClient);

export default router;
