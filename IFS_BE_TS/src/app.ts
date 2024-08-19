import express from 'express';
import cors from 'cors';

import { todosRouter } from './api/todos.router';
import db from './db/models';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cors());

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

  app.use('/todos', todosRouter);

  return app;
}
