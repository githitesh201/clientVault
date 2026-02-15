import { Request, Response } from 'express';
import { Client } from '../models/Client.js';
import { Invoice } from '../models/Invoice.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';

export async function getDashboardStats(_req: Request, res: Response): Promise<void> {
  const today = new Date();
  const [clients, activeProjects, pendingTasks, overdueInvoices] = await Promise.all([
    Client.countDocuments(),
    Project.countDocuments({ status: 'active' }),
    Task.countDocuments({ status: { $in: ['todo', 'in_progress', 'blocked'] } }),
    Invoice.countDocuments({ status: 'overdue', dueDate: { $lt: today } })
  ]);

  res.json({ clients, activeProjects, pendingTasks, overdueInvoices });
}
