import { Request, Response } from 'express';
import { z } from 'zod';
import { Notification } from '../models/Notification.js';
import { Task } from '../models/Task.js';
import { writeAuditLog } from '../services/auditService.js';

const taskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  projectId: z.string().min(1),
  assigneeId: z.string().min(1),
  dueDate: z.string(),
  priority: z.enum(['low', 'medium', 'high']).optional()
});

export async function createTask(req: Request, res: Response): Promise<void> {
  const payload = taskSchema.parse(req.body);
  const doc = await Task.create({ ...payload, dueDate: new Date(payload.dueDate) });

  await Notification.create({
    userId: payload.assigneeId,
    title: 'New task assigned',
    message: `Task \"${doc.title}\" has been assigned to you.`,
    type: 'task'
  });

  await writeAuditLog({
    userId: req.userId!,
    actionType: 'task_created',
    entity: 'Task',
    entityId: doc._id.toString(),
    metadata: { title: doc.title },
    ipAddress: req.ip
  });

  res.status(201).json(doc);
}

export async function listTasks(req: Request, res: Response): Promise<void> {
  const docs = await Task.find().populate('projectId', 'name').populate('assigneeId', 'name').sort({ dueDate: 1 }).lean();
  res.json(docs);
}

export async function updateTaskStatus(req: Request, res: Response): Promise<void> {
  const payload = z.object({ status: z.enum(['todo', 'in_progress', 'blocked', 'completed']) }).parse(req.body);
  const doc = await Task.findByIdAndUpdate(req.params.id, { status: payload.status }, { new: true });
  if (!doc) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }

  await writeAuditLog({
    userId: req.userId!,
    actionType: 'task_status_updated',
    entity: 'Task',
    entityId: doc._id.toString(),
    metadata: { status: payload.status },
    ipAddress: req.ip
  });

  res.json(doc);
}
