import { fromZonedTime } from 'date-fns-tz';
import Training, { ITraining } from '../db/models/training';
import User from '../db/models/user';
import { ApiError } from '../exceptions/api.error';
import {
  initializeTrainingsForWeek,
  timeZone,
} from '../utils/trainingInitiator';

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
  return Training.findById(id).populate('instructor').populate('reservations');
};

export const create = async (training: ITraining) => {
  const hours = Number(training.time.slice(0, 2));
  const date = `${training.date}T${String(hours).padStart(2, '0')}:00:00`;
  console.log('localDate', date);
  // const date = new Date(training.date);
  // date.setHours(hours);
  // console.log('trainingDate2', date);

  const trainingDateUtc = fromZonedTime(date, timeZone);
  console.log('trainingDateUtc', trainingDateUtc);

  training.date = trainingDateUtc;
  // throw new Error('Not implemented');
  const newTraining = new Training(training);
  return await newTraining.save();
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
