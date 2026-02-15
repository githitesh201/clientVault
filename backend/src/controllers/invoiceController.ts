import { Request, Response } from 'express';
import { z } from 'zod';
import { Invoice } from '../models/Invoice.js';
import { Notification } from '../models/Notification.js';
import { writeAuditLog } from '../services/auditService.js';

const invoiceSchema = z.object({
  projectId: z.string().min(1),
  clientId: z.string().min(1),
  amount: z.number().min(0),
  discount: z.number().min(0).optional(),
  notes: z.string().optional(),
  dueDate: z.string(),
  billingType: z.enum(['milestone', 'scheduled', 'full']).optional()
});

function nextInvoiceNo(): string {
  return `INV-${Date.now()}`;
}

export async function createInvoice(req: Request, res: Response): Promise<void> {
  const payload = invoiceSchema.parse(req.body);
  const doc = await Invoice.create({
    ...payload,
    invoiceNo: nextInvoiceNo(),
    dueDate: new Date(payload.dueDate)
  });

  await Notification.create({
    userId: req.userId!,
    title: 'Invoice generated',
    message: `Invoice ${doc.invoiceNo} generated for amount ${doc.amount}`,
    type: 'invoice'
  });

  await writeAuditLog({
    userId: req.userId!,
    actionType: 'invoice_created',
    entity: 'Invoice',
    entityId: doc._id.toString(),
    metadata: { invoiceNo: doc.invoiceNo },
    ipAddress: req.ip
  });

  res.status(201).json(doc);
}

export async function listInvoices(_req: Request, res: Response): Promise<void> {
  const now = new Date();
  await Invoice.updateMany({ status: { $in: ['issued', 'draft'] }, dueDate: { $lt: now } }, { status: 'overdue' });
  const docs = await Invoice.find().populate('projectId', 'name').populate('clientId', 'companyName').sort({ createdAt: -1 }).lean();
  res.json(docs);
}

export async function markInvoicePaid(req: Request, res: Response): Promise<void> {
  const doc = await Invoice.findByIdAndUpdate(req.params.id, { status: 'paid', paidAt: new Date() }, { new: true });
  if (!doc) {
    res.status(404).json({ message: 'Invoice not found' });
    return;
  }

  await writeAuditLog({
    userId: req.userId!,
    actionType: 'invoice_paid',
    entity: 'Invoice',
    entityId: doc._id.toString(),
    metadata: { invoiceNo: doc.invoiceNo },
    ipAddress: req.ip
  });

  res.json(doc);
}
