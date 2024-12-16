import Training, { ITraining } from '../db/models/training';
import User from '../db/models/user';
import { ApiError } from '../exceptions/api.error';
import { initializeTrainingsForWeek } from '../utils/trainingInitiator';

export const getAll = async (): Promise<ITraining[]> => {
  return await Training.find()
    .populate({
      path: 'instructor',
      select: 'firstName lastName',
    })
    .populate({
      path: 'reservations',
      // select: 'firstName lastName',
    });
};

export const getById = async (id: string): Promise<ITraining | null> => {
  return Training.findById(id).populate('instructor').populate('visitors');
};

export const create = async (body: ITraining) => {
  const newTraining = new Training(body);
  await newTraining.save();
  return newTraining;
};

// export const update = async (
//   trainingId: string,
//   userId: string,
// ) => {
//   const training = await Training.findById(trainingId);
//   const user = await User.findById(userId);

//   if (!user || !training) {
//     throw ApiError.NotFound({
//       error: 'User or Training not found.',
//     });
//   }

//   return training;
// };

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

export const initializeWeek = async (day?: number, month?: number) => {
  await initializeTrainingsForWeek(day, month);
};
