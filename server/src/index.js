import { connectDB } from './config/db.js';
import { seedQuestions } from './utils/seedQuestions.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { getStorage } from './services/storage/index.js';
import app from './app.js';

async function start() {
  await connectDB();
  await seedQuestions();

  const storage = getStorage();
  if (storage.ensureDir) {
    await storage.ensureDir();
  }

  app.listen(env.port, () => {
    logger.info(`Server running on http://localhost:${env.port}`);
    logger.info(`Storage driver: ${env.storageDriver}`);
    logger.info(`CORS origin: ${env.clientUrl}`);
  });
}

start().catch((err) => {
  logger.error('Failed to start server', err);
  process.exit(1);
});
