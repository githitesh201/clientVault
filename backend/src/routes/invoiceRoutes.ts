import { Router } from 'express';
import { createInvoice, listInvoices, markInvoicePaid } from '../controllers/invoiceController.js';
import { authGuard } from '../middleware/auth.js';
import { permit } from '../middleware/roles.js';

const router = Router();

router.use(authGuard);
router.get('/', listInvoices);
router.post('/', permit('admin', 'manager'), createInvoice);
router.patch('/:id/pay', permit('admin', 'manager', 'client'), markInvoicePaid);

export default router;
