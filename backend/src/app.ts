import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export const app = express();

const allowedOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean);
const corsOrigin = (
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void
): void => {
  const isExplicitlyAllowed = !!origin && allowedOrigins.includes(origin);
  const isLocalDevOrigin =
    env.NODE_ENV === 'development' && !!origin && /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

  if (!origin || isExplicitlyAllowed || isLocalDevOrigin) {
    callback(null, true);
    return;
  }

  callback(new Error('Origin not allowed by CORS'));
};

app.use(helmet());
app.use(
  cors({
    origin: corsOrigin,
    credentials: false
  })
);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 250 }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get(['/health', '/api/health'], (_req: any, res: any) => {
  res.json({ status: 'ok' });
});

app.use(notFoundHandler);
app.use(errorHandler);
