import { fromZonedTime } from 'date-fns-tz';
import Training from '../db/models/Training.js';
import {
  initializeTrainingsForWeek,
  timeZone,
} from '../utils/trainingInitiator.js';

export const getAll = async () => {
  return await Training.find()
    .populate({
      path: 'instructor',
      select: 'firstName lastName',
    })
    .populate({
      path: 'reservations',
      populate: {
        path: 'user',
        select: 'firstName lastName',
      },
    });
};

export const getById = async id => {
  const training = Training.findById(id)
    .populate('instructor')
    .populate('reservations');

  if (training) {
    return training;
  } else {
    throw ApiError.NotFound({ training: 'Not found' });
  }
};
export const create = async training => {
  const hours = Number(training.time.slice(0, 2));
  const date = `${training.date}T${String(hours).padStart(2, '0')}:00:00`;
  const trainingDateUtc = fromZonedTime(date, timeZone);
  training.date = trainingDateUtc;

  const newTraining = new Training(training);
  return await newTraining.save();
};

export const remove = async trainingId => {
  const training = await Training.findById(trainingId);
  if (!training) {
    throw new Error('Training not found.');
  }
  await training.deleteOne();
};
export const removeAll = async () => {
  await Training.deleteMany({});
};
export const initializeWeek = async day => {
  await initializeTrainingsForWeek(day);
};
