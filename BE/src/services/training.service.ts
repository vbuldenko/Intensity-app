import db from '../db/models';
import { ApiError } from '../exceptions/api.error';
import { Training } from '../types/Training';
import { initializeTrainingsForWeek } from '../utils/trainingInitiator';
import * as userService from './user.service';

interface UpdateBody {
  updateType: 'reservation' | 'cancellation';
}

export const getAll = async (): Promise<Training> => {
  return await db.Training.findAll({
    include: [
      {
        model: db.User,
        as: 'instructor',
        attributes: ['firstName', 'lastName'],
      },
      { model: db.User, as: 'visitors' },
    ],
  });
};

export const getById = async (id: number): Promise<Training> => {
  return db.Training.findOne({ where: { id } });
};

export const create = async (body: Training) => {
  // const instructor = userService.getById(body.instructorId);
  return await db.Training.create({ ...body });
};

export const update = async (
  abonementId: number,
  trainingId: number,
  userId: number,
  updateType: 'reservation' | 'cancellation',
) => {
  const abonement = await db.Abonement.findByPk(abonementId);
  const training = await db.Training.findByPk(trainingId);
  const user = await db.User.findByPk(userId);

  if (!user || !abonement || !training) {
    throw ApiError.NotFound({
      error: 'User, Abonement, or Training not found.',
    });
  }

  switch (updateType) {
    case 'reservation':
      if (await training.hasVisitor(user)) {
        throw ApiError.BadRequest(
          'Already reserved: You have already reserved your place!',
        );
      }

      // await training.addAbonement(abonement);
      // await training.addVisitor(user);
      await db.History.create({
        abonementId,
        trainingId,
        userId,
      });
      break;
    case 'cancellation':
      if (!(await training.hasVisitor(user))) {
        throw ApiError.BadRequest(
          'Not reserved: You have not reserved a place!',
        );
      }
      // await abonement.removeTraining(training);
      // await training.removeVisitor(user);

      await db.History.destroy({
        where: {
          abonementId,
          trainingId,
          userId,
        },
      });
      break;
    default:
      throw ApiError.BadRequest('Invalid updateType');
  }

  return training;
};

export const remove = async (trainingId: number) => {
  const training = await db.Training.findByPk(trainingId);
  if (!training) {
    throw new Error('Training not found.');
  }
  await training.destroy();
};

export const removeAll = async () => {
  await db.Training.destroy({ where: {} });
};

export const initializeWeek = async (day?: number) => {
  await initializeTrainingsForWeek(day);
};
