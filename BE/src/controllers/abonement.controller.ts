import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../exceptions/api.error';
import * as abonementService from '../services/abonement.service';
import { getUserFromRequest } from '../utils';

export async function getAll(req: Request, res: Response): Promise<void> {
  const user = getUserFromRequest(req);
  if (user.role !== 'admin') {
    throw ApiError.Unauthorized();
  }

  const abonements = await abonementService.getAll();
  res.send(abonements);
}

export async function getAllByUserId(
  req: Request,
  res: Response,
): Promise<void> {
  const user = getUserFromRequest(req);
  const abonements = await abonementService.getAllByUserId(user.id);
  res.send(abonements);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const abonement = await abonementService.getById(req.params.id);
  if (abonement) {
    res.json(abonement);
  } else {
    throw ApiError.NotFound({ abonement: 'Not found' });
  }
}

// export async function update(req: Request, res: Response): Promise<void> {
//   const user = getUserFromRequest(req);
//   const abonementId = Number(req.params.id);

//   const updatedAbonement = await abonementService.update(
//     abonementId,
//     user.id,
//     req.body,
//   );
//   res.json(updatedAbonement);
// }

export async function create(req: Request, res: Response): Promise<void> {
  const user = getUserFromRequest(req);

  const newAbonement = await abonementService.create(req.body, user);
  res.status(201).json(newAbonement);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const user = getUserFromRequest(req);
  const abonementId = req.params.id;

  await abonementService.remove(abonementId, user);
  res.sendStatus(204);
}
