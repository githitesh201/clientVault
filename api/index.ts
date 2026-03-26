import { app } from '../backend/src/app.js';
import { connectDatabase } from '../backend/src/config/database.js';
import { env } from '../backend/src/config/env.js';

export default async function handler(req: any, res: any): Promise<void> {
  await connectDatabase(env.MONGO_URI);
  const handle = app as unknown as (request: any, response: any) => void;
  handle(req, res);
}
