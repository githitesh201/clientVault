import { NextFunction, Request, Response } from 'express';
import { User } from '../models/User.js';
import { HttpError } from '../utils/httpError.js';

export function permit(...roles: Array<'admin' | 'manager' | 'staff' | 'client'>) {
  return async function roleGuard(req: Request, _res: Response, next: NextFunction): Promise<void> {
    if (!req.userId) return next(new HttpError('Unauthorized', 401));

    const user = await User.findById(req.userId).lean();
    if (!user) return next(new HttpError('Unauthorized', 401));

    if (!roles.includes(user.role)) {
      return next(new HttpError('Forbidden', 403));
    }

    next();
  };
}
