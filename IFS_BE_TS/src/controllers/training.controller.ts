// controllers/training.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as trainingService from '../services/training.service';
import { UserDTO } from '../types/UserDTO';

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const trainingSessions = await trainingService.getAll();
  res.json(trainingSessions);
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { body } = req;
  const user = req.user as UserDTO;

  if (!user || user.role !== 'admin') {
    return res.status(401).json({ error: 'Operation not permitted' });
  }

  const newTraining = await trainingService.create(body);
  res.status(201).json(newTraining);
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const trainingId = Number(req.params.id);
  const user = req.user as UserDTO;
  const { updateType } = req.body;

  if (!user) {
    return res.status(401).json({
      error: 'Unauthorized: User not authenticated or not in client role.',
    });
  }

  const updatedTraining = await trainingService.update(
    trainingId,
    user.id,
    updateType,
  );
  res.json(updatedTraining);
};

// export const initialize = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const user = req.user as UserDTO;
//   const { mode } = req.params;

//   if (!user || user.role !== 'admin') {
//     return res.status(401).json({ error: 'Operation not permitted' });
//   }

//   await trainingService.initialize(mode);
//   res.status(201).end();
// };

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user as UserDTO;

  if (!user || user.role !== 'admin') {
    return res.status(401).json({ error: 'Operation not permitted' });
  }

  await trainingService.remove(Number(req.params.id));
  res.status(204).end();
};

export const removeMany = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user as UserDTO;

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Operation not permitted' });
  }

  await trainingService.removeAll();
  res.status(204).end();
};
