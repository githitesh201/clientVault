import { NextFunction, Request, Response } from 'express';
import { User } from '../models/User.js';
import { verifyAuthToken } from '../services/tokenService.js';
import { HttpError } from '../utils/httpError.js';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}

export async function authGuard(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

  if (!token) {
    return next(new HttpError('Missing authentication token', 401));
  }

  try {
    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub).lean();

    if (!user) {
      return next(new HttpError('Invalid session', 401));
    }

    req.userId = user._id.toString();
    return next();
  } catch {
    return next(new HttpError('Invalid or expired token', 401));
  }
}
