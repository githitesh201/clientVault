import { Request, Response } from 'express';
import { AuditLog } from '../models/AuditLog.js';
import { User } from '../models/User.js';

export async function listUsers(_req: Request, res: Response): Promise<void> {
  const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
  res.json(users);
}

export async function listAuditLogs(_req: Request, res: Response): Promise<void> {
  const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100).lean();
  res.json(logs);
}
