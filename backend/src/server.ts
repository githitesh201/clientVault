import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';

async function bootstrap(): Promise<void> {
  await connectDatabase(env.MONGO_URI);
  app.listen(env.PORT, () => {
    console.log(`ClientVault API running on port ${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start API', error);
  process.exit(1);
});
