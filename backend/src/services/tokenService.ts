import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAuthToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: '8h' });
}

export function verifyAuthToken(token: string): { sub: string } {
  return jwt.verify(token, env.JWT_SECRET) as { sub: string };
}
