import Training, { ITraining } from '../db/mdbmodels/Training';
import User from '../db/mdbmodels/User';
import Abonement from '../db/mdbmodels/Abonement';
import History from '../db/mdbmodels/History';
import { ApiError } from '../exceptions/api.error';
import { initializeTrainingsForWeek } from '../utils/trainingInitiator';

export const getAll = async (): Promise<ITraining[]> => {
  return await Training.find()
    .populate({
      path: 'instructor',
      select: 'firstName lastName',
    })
    .populate('visitors');
};

export const getById = async (id: string): Promise<ITraining | null> => {
  return Training.findById(id).populate('instructor').populate('visitors');
};

export const create = async (body: ITraining) => {
  const newTraining = new Training(body);
  await newTraining.save();
  return newTraining;
};

export const update = async (
  abonementId: string,
  trainingId: string,
  userId: string,
  updateType: 'reservation' | 'cancellation',
) => {
  const abonement = await Abonement.findById(abonementId);
  const training = await Training.findById(trainingId);
  const user = await User.findById(userId);

  if (!user || !abonement || !training) {
    throw ApiError.NotFound({
      error: 'User, Abonement, or Training not found.',
    });
  }

  switch (updateType) {
    case 'reservation':
      const existingHistory = await History.findOne({
        abonementId,
        trainingId,
        userId,
      });

      if (existingHistory) {
        throw ApiError.BadRequest(
          'Already reserved: You have already reserved your place!',
        );
      }

      await new History({
        abonementId,
        trainingId,
        userId,
      }).save();
      break;
    case 'cancellation':
      const history = await History.findOne({
        abonementId,
        trainingId,
        userId,
      });

      if (!history) {
        throw ApiError.BadRequest(
          'Not reserved: You have not reserved a place!',
        );
      }

      await History.deleteOne({
        abonementId,
        trainingId,
        userId,
      });
      break;
    default:
      throw ApiError.BadRequest('Invalid updateType');
  }

  return training;
};

export const remove = async (trainingId: string) => {
  const training = await Training.findById(trainingId);
  if (!training) {
    throw new Error('Training not found.');
  }
  await training.deleteOne();
};

export const removeAll = async () => {
  await Training.deleteMany({});
};

export const initializeWeek = async (day?: number) => {
  await initializeTrainingsForWeek(day);
};
