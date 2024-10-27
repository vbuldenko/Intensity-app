import { Request, Response } from 'express';
import * as trainingService from '../services/training.service';
import * as abonementService from '../services/abonement.service';
import { ApiError } from '../exceptions/api.error';
import { UserDTO } from '../types/UserDTO';
import {
  cancelNotHeldTrainings,
  updateReservation,
} from '../services/reservation.service';
import { getUserFromRequest } from '../utils';

export const reserve = async (req: Request, res: Response) => {
  const user = getUserFromRequest(req);
  const abonementId = Number(req.query.abonementId);
  const trainingId = Number(req.query.trainingId);
  const { updateType } = req.body;

  const updatedData = await updateReservation(
    abonementId,
    trainingId,
    user.id,
    updateType,
  );

  res.send(updatedData);
};

export const cancelCheck = async (req: Request, res: Response) => {
  const { abonementId } = req.body;

  const data = await cancelNotHeldTrainings(abonementId);
  res.status(200).send(data);
};
