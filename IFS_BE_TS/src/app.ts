import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRouter from './api/auth.route';
import userRouter from './api/user.route';
import abonementRouter from './api/abonement.route';
import trainingRouter from './api/training.route';
// import db from './db/models';
import { requestLogger } from './middlewares/logger.middleware';
import { passport } from './services/passport';
import { authMiddleware } from './middlewares/auth.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import { unknownEndpoint } from './middlewares/helper.middleware';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);
  app.use(cookieParser());

  app.use(passport.initialize());

  app.use('/', authRouter);
  app.use('/users', authMiddleware, userRouter);
  app.use('/abonements', authMiddleware, abonementRouter);
  app.use('/trainings', authMiddleware, trainingRouter);
  console.log(new Date());

  // async function createUser() {
  //   try {
  // console.log(db);
  //     const newUser = await db.User.create({
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       email: 'john.doe@example.com',
  //     });

  //     console.log('User created:', newUser.toJSON());
  //   } catch (error) {
  //     console.error('Error creating user:', error);
  //   }
  // }

  // createUser();
  // db.sequelize.sync();
  app.use(unknownEndpoint);
  app.use(errorMiddleware);

  return app;
}
