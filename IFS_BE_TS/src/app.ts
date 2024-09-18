import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRouter from './api/auth.route';
import userRouter from './api/user.route';
import abonementRouter from './api/abonement.route';
import trainingRouter from './api/training.route';
import { passport } from './services/passport';
import { requestLogger } from './middlewares/logger.middleware';
import { authMiddleware } from './middlewares/auth.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import { unknownEndpoint } from './middlewares/helper.middleware';
import { hashPassword } from './utils';
// import db from './db/models';

export function createApp() {
  const app = express();
  console.log(process.env.CLIENT_URL);

  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(requestLogger);
  app.use(cookieParser());

  app.use(passport.initialize());

  app.use('/', authRouter);
  app.use('/users', authMiddleware, userRouter);
  app.use('/abonements', authMiddleware, abonementRouter);
  app.use('/trainings', authMiddleware, trainingRouter);

  // db.sequelize.sync();
  app.use(unknownEndpoint);
  app.use(errorMiddleware);

  return app;
}
