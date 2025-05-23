import * as trainingService from '../services/training.service.js';

export const getAll = async (req, res) => {
  const trainingSessions = await trainingService.getAll();
  res.json(trainingSessions);
};
export const getById = async (req, res) => {
  const training = await trainingService.getById(req.params.id);
  res.json(training);
};
export const create = async (req, res) => {
  const newTraining = await trainingService.create(req.body);
  res.status(201).json(newTraining);
};
// export const update = async (req: Request, res: Response) => {
//   const user = getUserFromRequest(req);
//   const abonementId = Number(req.query.abonementId);
//   const trainingId = Number(req.query.trainingId);
//   const { updateType } = req.body;
//   if (isNaN(abonementId) || isNaN(trainingId)) {
//     throw ApiError.BadRequest('Validation error', {
//       id: 'Invalid ID format. IDs must be numbers.',
//     });
//   }
//   if (!user) {
//     throw ApiError.Unauthorized();
//   }
//   const updatedTraining = await trainingService.update(
//     abonementId,
//     trainingId,
//     user.id,
//     updateType,
//   );
//   res.json(updatedTraining);
// };
export const remove = async (req, res) => {
  await trainingService.remove(req.params.id);
  res.status(204).end();
};
export const removeMany = async (req, res, next) => {
  await trainingService.removeAll();
  res.status(204).end();
};
export const initializeCurrentWeek = async (req, res) => {
  const { day, month } = req.body;
  await trainingService.initializeWeek(day, month);
  res.status(201).json({ message: 'Success' });
};
