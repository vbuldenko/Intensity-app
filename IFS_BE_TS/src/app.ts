import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRouter from './api/auth.route';
import db from './db/models';
import { requestLogger } from './middlewares/logger.middleware';
import { passport } from './services/passport';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);
  app.use(cookieParser());

  app.use(passport.initialize());

  app.use('/', authRouter);

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

  app.use('/', (req, res) => res.send('Hello'));

  return app;
}
