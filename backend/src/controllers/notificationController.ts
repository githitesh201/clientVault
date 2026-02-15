import { Request, Response } from 'express';
import { Notification } from '../models/Notification.js';

export async function listNotifications(req: Request, res: Response): Promise<void> {
  const docs = await Notification.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(20).lean();
  res.json(docs);
}

export async function markNotificationRead(req: Request, res: Response): Promise<void> {
  const doc = await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { read: true }, { new: true });
  if (!doc) {
    res.status(404).json({ message: 'Notification not found' });
    return;
  }

  res.json(doc);
}
