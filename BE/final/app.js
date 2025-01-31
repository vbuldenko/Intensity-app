import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './api/auth.route.js';
import userRouter from './api/user.route.js';
import abonementRouter from './api/abonement.route.js';
import trainingRouter from './api/training.route.js';
import scheduleRouter from './api/schedule.route.js';
import { passport } from './services/passport.js';
import { requestLogger } from './middlewares/logger.middleware.js';
import {
  adminCheckerMiddleware,
  authMiddleware,
} from './middlewares/auth.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { unknownEndpoint } from './middlewares/helper.middleware.js';
import connectToDB from './db/db.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export function createApp() {
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
  app.use('/schedule', authMiddleware, adminCheckerMiddleware, scheduleRouter);
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../ui', 'index.html'));
  });
  app.use(unknownEndpoint);
  app.use(errorMiddleware);
  return app;
}
