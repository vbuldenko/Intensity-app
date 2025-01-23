import * as reservationService from '../services/reservation.service.js';
import { getUserFromRequest } from '../utils/index.js';
export const reserve = async (req, res) => {
  const user = getUserFromRequest(req);
  const abonementId = req.query.abonementId;
  const trainingId = req.query.trainingId;
  const { updateType } = req.body;
  const updatedData = await reservationService.updateReservation(
    abonementId,
    trainingId,
    user.id,
    updateType,
  );
  res.send(updatedData);
};
export const cancelCheck = async (req, res) => {
  const { abonementId } = req.body;
  const data = await reservationService.cancelNotHeldTrainings(abonementId);
  res.status(200).send(data);
};
export const cancelTraining = async (req, res) => {
  const trainingId = req.params.id;
  const updatedTraining =
    await reservationService.cancelTrainingByAdmin(trainingId);
  res.send(updatedTraining);
};
