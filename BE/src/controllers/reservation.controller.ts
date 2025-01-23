import { Request, Response } from 'express';
import * as reservationService from '../services/reservation.service';
import { ApiError } from '../exceptions/api.error';
import { getUserFromRequest } from '../utils';

export const reserve = async (req: Request, res: Response) => {
  const user = getUserFromRequest(req);
  const abonementId = req.query.abonementId as string;
  const trainingId = req.query.trainingId as string;
  const { updateType } = req.body;

  const updatedData = await reservationService.updateReservation(
    abonementId,
    trainingId,
    user.id,
    updateType,
  );

  res.send(updatedData);
};

export const cancelCheck = async (req: Request, res: Response) => {
  const { abonementId } = req.body;

  const data = await reservationService.cancelNotHeldTrainings(abonementId);
  res.status(200).send(data);
};

export const cancelTraining = async (req: Request, res: Response) => {
  const trainingId = req.params.id;
  const updatedTraining =
    await reservationService.cancelTrainingByAdmin(trainingId);
  res.send(updatedTraining);
};
