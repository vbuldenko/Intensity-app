import { Request, Response } from 'express';
import * as trainingService from '../services/training.service';
import * as abonementService from '../services/abonement.service';
import { ApiError } from '../exceptions/api.error';
import { UserDTO } from '../types/UserDTO';
import { updateReservation } from '../services/reservation.service';

export const reserve = async (req: Request, res: Response) => {
  const abonementId = Number(req.query.abonementId);
  const trainingId = Number(req.query.trainingId);
  const user = req.user as UserDTO;
  const { updateType } = req.body;

  if (!user) {
    throw ApiError.Unauthorized();
  }

  const updatedData = await updateReservation(
    abonementId,
    trainingId,
    user.id,
    updateType,
  );

  res.send(updatedData);
};
