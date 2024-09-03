import { Request, Response } from 'express';
import * as trainingService from '../services/training.service';
import * as abonementService from '../services/abonement.service';
import { ApiError } from '../exceptions/api.error';
import { UserDTO } from '../types/UserDTO';

export const reserve = async (req: Request, res: Response) => {
  const abonementId = Number(req.params.id);
  const trainingId = Number(req.params.id);
  const user = req.user as UserDTO;
  const { updateType } = req.body;

  if (!user) {
    throw ApiError.Unauthorized();
  }

  const updatedTraining = await trainingService.update(
    trainingId,
    user.id,
    updateType,
  );

  const updatedAbonement = await abonementService.update(
    abonementId,
    user.id,
    req.body,
  );

  res.status(200).send({ message: 'reserved successfully' });
};
