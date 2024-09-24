import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../exceptions/api.error';
import * as abonementService from '../services/abonement.service';

export async function getAll(req: Request, res: Response): Promise<void> {
  const abonements = await abonementService.getAll();
  res.send(abonements);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const abonement = await abonementService.getById(Number(req.params.id));
  if (abonement) {
    res.json(abonement);
  } else {
    throw ApiError.NotFound({ abonement: 'Not found' });
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  const { body, user } = req;
  const abonementId = Number(req.params.id);

  if (!user) {
    throw ApiError.Unauthorized();
  }

  const updatedAbonement = await abonementService.update(
    abonementId,
    user.id,
    body,
  );
  res.json(updatedAbonement);
}

export async function create(req: Request, res: Response): Promise<void> {
  const { body, user } = req;

  if (!user) {
    throw ApiError.Unauthorized();
  }

  const newAbonement = await abonementService.create(body, user);
  res.status(201).json(newAbonement);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const abonementId = Number(req.params.id);
  const { user } = req;

  await abonementService.remove(abonementId, user);
  res.sendStatus(204);
}
