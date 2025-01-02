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
    .populate('reservations');
};

export const getById = async id => {
  return Training.findById(id).populate('instructor').populate('reservations');
};
export const create = async training => {
  const hours = Number(training.time.slice(0, 2));
  const date = `${training.date}T${String(hours).padStart(2, '0')}:00:00`;
  console.log('localTrainingDate', date);
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
