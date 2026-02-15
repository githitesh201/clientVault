import { Request, Response } from 'express';
import { z } from 'zod';
import { Project } from '../models/Project.js';
import { writeAuditLog } from '../services/auditService.js';

const projectSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  clientId: z.string().min(1),
  managerId: z.string().min(1),
  startDate: z.string(),
  dueDate: z.string(),
  budget: z.number().min(0).optional(),
  status: z.enum(['planned', 'active', 'on_hold', 'completed']).optional()
});

export async function createProject(req: Request, res: Response): Promise<void> {
  const payload = projectSchema.parse(req.body);
  const doc = await Project.create({
    ...payload,
    startDate: new Date(payload.startDate),
    dueDate: new Date(payload.dueDate)
  });

  await writeAuditLog({
    userId: req.userId!,
    actionType: 'project_created',
    entity: 'Project',
    entityId: doc._id.toString(),
    metadata: { name: doc.name },
    ipAddress: req.ip
  });

  res.status(201).json(doc);
}

export async function listProjects(req: Request, res: Response): Promise<void> {
  const docs = await Project.find().populate('clientId', 'companyName').populate('managerId', 'name role').lean();
  res.json(docs);
}

export async function updateProjectStatus(req: Request, res: Response): Promise<void> {
  const payload = z.object({ status: z.enum(['planned', 'active', 'on_hold', 'completed']) }).parse(req.body);
  const doc = await Project.findByIdAndUpdate(req.params.id, { status: payload.status }, { new: true });
  if (!doc) {
    res.status(404).json({ message: 'Project not found' });
    return;
  }

  await writeAuditLog({
    userId: req.userId!,
    actionType: 'project_status_updated',
    entity: 'Project',
    entityId: doc._id.toString(),
    metadata: { status: payload.status },
    ipAddress: req.ip
  });

  res.json(doc);
}
