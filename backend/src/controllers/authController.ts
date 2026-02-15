import { Request, Response } from 'express';
import { z } from 'zod';
import { User } from '../models/User.js';
import { signAuthToken } from '../services/tokenService.js';
import { HttpError } from '../utils/httpError.js';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['admin', 'manager', 'staff', 'client']).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function register(req: Request, res: Response): Promise<void> {
  const payload = registerSchema.parse(req.body);
  const existing = await User.findOne({ email: payload.email }).lean();

  if (existing) {
    throw new HttpError('Email already exists', 409);
  }

  const user = await User.create(payload);
  const token = signAuthToken(user._id.toString());
  res.status(201).json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
}

export async function login(req: Request, res: Response): Promise<void> {
  const payload = loginSchema.parse(req.body);
  const user = await User.findOne({ email: payload.email }).select('+password');

  if (!user || !(await user.verifyPassword(payload.password))) {
    throw new HttpError('Invalid credentials', 401);
  }

  const token = signAuthToken(user._id.toString());
  res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
}
