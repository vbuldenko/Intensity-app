import db from '../db/models';
import { Training } from '../types/Training';

// import initializeTrainingSessions from '../utils/trainingsInitiator';

const { Abonement, User, Training } = db;

interface UpdateBody {
  updateType: 'reservation' | 'cancellation';
  userId: string;
}

export const getAll = async (): Promise<Training> => {
  return await Training.findAll({
    include: [
      {
        model: User,
        as: 'instructor',
        attributes: ['surname', 'name'],
      },
      { model: User, as: 'visitors' },
    ],
  });
};

export const create = async (body: Training) => {
  return await Training.create(body);
};

export const update = async (
  trainingId: number,
  userId: string,
  updateType: 'reservation' | 'cancellation',
) => {
  const training = await Training.findByPk(trainingId, {
    include: [
      { model: User, as: 'instructor' },
      { model: User, as: 'visitors' },
    ],
  });
  const user = await User.findByPk(userId);

  if (!training) {
    throw new Error('Training not found.');
  }

  switch (updateType) {
    case 'reservation':
      if (await training.hasVisitor(user)) {
        throw new Error(
          'Already reserved: You have already reserved your place!',
        );
      }
      await training.addVisitor(user);
      break;
    case 'cancellation':
      if (!(await training.hasVisitor(user))) {
        throw new Error('Not reserved: You have not reserved a place!');
      }
      await training.removeVisitor(user);
      break;
    default:
      throw new Error('Invalid updateType.');
  }

  return training;
};

export const remove = async (trainingId: number) => {
  const training = await Training.findByPk(trainingId);
  if (!training) {
    throw new Error('Training not found.');
  }
  await training.destroy();
};

export const removeAll = async () => {
  await Training.destroy({ where: {} });
};

// export const initializeTrainings = (mode: string) => {
//   initializeTrainingSessions(mode);
// };
