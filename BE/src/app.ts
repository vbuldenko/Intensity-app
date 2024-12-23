import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRouter from './api/auth.route';
import userRouter from './api/user.route';
import abonementRouter from './api/abonement.route';
import trainingRouter from './api/training.route';
import scheduleRouter from './api/schedule.route';
import { passport } from './services/passport';
import { requestLogger } from './middlewares/logger.middleware';
import { authMiddleware } from './middlewares/auth.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import { unknownEndpoint } from './middlewares/helper.middleware';
import connectToDB from './db/db';
import { initializePredefinedSchedule } from './utils/trainingInitiator';

// import { runTest } from './monoApiAcquiring/monobank.test.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  // Connect to MongoDB
  connectToDB();
  // initializePredefinedSchedule();

  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_HOST,
      credentials: true,
    }),
  );
  app.use(express.static('ui'));
  app.use(express.json());
  app.use(requestLogger);
  app.use(cookieParser());

  app.use(passport.initialize());

  app.use('/', authRouter);
  app.use('/users', authMiddleware, userRouter);
  app.use('/abonements', authMiddleware, abonementRouter);
  app.use('/trainings', trainingRouter);
  app.use('/schedule', authMiddleware, scheduleRouter);

  // Serve the React app for any other route
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../ui', 'index.html'));
  });

  app.use(unknownEndpoint);
  app.use(errorMiddleware);

  return app;
}
