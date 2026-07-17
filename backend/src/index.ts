import cors from 'cors';
import express from 'express';
import http from 'http';
import { config } from './config';
import { pool } from './database/pool';
import apiRouter from './routes';
import { historySnapshotScheduler } from './services/historyService';
import { simulationService } from './services/simulationService';
import { createSocketServer } from './socket';
import { errorHandler } from './utils/asyncHandler';
import { logger } from './utils/logger';

async function bootstrap(): Promise<void> {
  const app = express();

  app.use(
    cors({
      origin: config.corsOrigin,
    })
  );
  app.use(express.json());

  app.use('/api', apiRouter);

  app.use(errorHandler);

  const server = http.createServer(app);
  const io = createSocketServer(server);

  await pool.query('SELECT 1');
  logger.info('Database connection verified');

  simulationService.start(io);
  historySnapshotScheduler.start();

  server.listen(config.port, () => {
    logger.info(`Medical Dashboard API listening on port ${config.port}`);
    logger.info(`CORS origin: ${config.corsOrigin}`);
  });

  const shutdown = async (): Promise<void> => {
    logger.info('Shutting down...');
    historySnapshotScheduler.stop();
    simulationService.stop();
    server.close();
    await pool.end();
    process.exit(0);
  };

  process.on('SIGINT', () => {
    void shutdown();
  });
  process.on('SIGTERM', () => {
    void shutdown();
  });
}

bootstrap().catch((error) => {
  logger.error('Failed to start server', error);
  process.exit(1);
});
