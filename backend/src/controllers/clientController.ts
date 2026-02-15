import { Request, Response } from 'express';
import { z } from 'zod';
import { Client } from '../models/Client.js';

const clientSchema = z.object({
  companyName: z.string().min(2),
  contactName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  status: z.enum(['lead', 'active', 'inactive']).default('lead'),
  notes: z.string().max(600).optional()
});

export async function createClient(req: Request, res: Response): Promise<void> {
  const payload = clientSchema.parse(req.body);
  const doc = await Client.create({ ...payload, createdBy: req.userId });
  res.status(201).json(doc);
}

export async function listClients(req: Request, res: Response): Promise<void> {
  const docs = await Client.find({ createdBy: req.userId }).sort({ createdAt: -1 }).lean();
  res.json(docs);
}
