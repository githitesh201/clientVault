import { Router } from 'express';
import { createInvoice, listInvoices, markInvoicePaid } from '../controllers/invoiceController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authGuard } from '../middleware/auth.js';
import { permit } from '../middleware/roles.js';

const router = Router();

router.use(asyncHandler(authGuard));
router.get('/', asyncHandler(listInvoices));
router.post('/', asyncHandler(permit('admin', 'manager')), asyncHandler(createInvoice));
router.patch('/:id/pay', asyncHandler(permit('admin', 'manager', 'client')), asyncHandler(markInvoicePaid));

export default router;
