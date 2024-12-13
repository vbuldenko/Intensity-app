import Training from '../db/models/Training.js';
import { initializeTrainingsForWeek } from '../utils/trainingInitiator.js';
export const getAll = async () => {
  return await Training.find()
    .populate({
      path: 'instructor',
      select: 'firstName lastName',
    })
    .populate('visitors');
};
export const getById = async id => {
  return Training.findById(id).populate('instructor').populate('visitors');
};
export const create = async body => {
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
