// controllers/training.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as trainingService from '../services/training.service';
import { UserDTO } from '../types/UserDTO';
import { ApiError } from '../exceptions/api.error';
import abonement from '../db/models/abonement';

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const trainingSessions = await trainingService.getAll();
  res.json(trainingSessions);
};

export async function getById(req: Request, res: Response): Promise<void> {
  const training = await trainingService.getById(Number(req.params.id));
  if (training) {
    res.json(training);
  } else {
    throw ApiError.NotFound({ training: 'Not found' });
  }
}

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
  const abonementId = Number(req.query.abonementId);
  const trainingId = Number(req.query.trainingId);
  const user = req.user as UserDTO;
  const { updateType } = req.body;

  if (isNaN(abonementId) || isNaN(trainingId)) {
    throw ApiError.BadRequest('Validation error', {
      id: 'Invalid ID format. IDs must be numbers.',
    });
  }

  if (!user) {
    throw ApiError.Unauthorized();
  }

  const updatedTraining = await trainingService.update(
    abonementId,
    trainingId,
    user.id,
    updateType,
  );
  res.json(updatedTraining);
};

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

export const initializeCurrentWeek = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user as UserDTO;

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Operation not permitted' });
  }

  await trainingService.initializeWeek();
  res.status(201).end();
};
