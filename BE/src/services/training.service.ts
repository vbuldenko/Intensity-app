import { fromZonedTime } from 'date-fns-tz';
import { addDays, endOfWeek, startOfWeek } from 'date-fns';
import Training, { ITraining } from '../db/models/training';
import { ApiError } from '../exceptions/api.error';
import { timeZone } from '../utils';
import scheduleService from './schedule.service';

export const getAll = async (): Promise<ITraining[]> => {
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

export const getById = async (id: string): Promise<ITraining | null> => {
  const training = Training.findById(id)
    .populate('instructor')
    .populate('reservations');

  if (training) {
    return training;
  } else {
    throw ApiError.NotFound({ training: 'Not found' });
  }
};

export const create = async (training: ITraining) => {
  const hours = Number(training.time.slice(0, 2));
  const date = `${training.date}T${String(hours).padStart(2, '0')}:00:00`;
  const trainingDateUtc = fromZonedTime(date, timeZone);

  training.date = trainingDateUtc;

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

export const initializeWeek = async (
  day?: number,
  month?: number,
  year?: number,
) => {
  const now = new Date();
  const providedDate = new Date(
    year ?? now.getFullYear(),
    month ?? now.getMonth(), // month is 0-indexed
    day ?? now.getDate(),
  );

  // Ensure the date is the Monday of the given or current week
  const startDate = startOfWeek(providedDate, {
    weekStartsOn: 1,
  });
  const endDate = endOfWeek(providedDate, { weekStartsOn: 1 });

  try {
    const existingTrainings = await Training.findOne({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    if (existingTrainings) {
      throw ApiError.BadRequest('Already initialized for current week');
    }

    const scheduleTrainings = await scheduleService.getAll();

    // Days of the week in proper order
    const daysOfWeek = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];

    // Create an array of trainings with the proper date
    const trainings = scheduleTrainings.map(session => {
      const dayIndex = daysOfWeek.indexOf(session.day);
      const hours = Number(session.time.slice(0, 2));
      let trainingDate = addDays(startDate, dayIndex);
      trainingDate.setHours(hours, 0, 0, 0);

      // Convert the trainingDate to UTC directly, interpreting it as Kyiv timezone
      const trainingDateUtc = fromZonedTime(trainingDate, timeZone);

      return {
        type: session.type,
        instructor: session.instructor,
        capacity: session.maxCapacity,
        date: trainingDateUtc,
        day: session.day,
        time: session.time,
      };
    });

    // Save trainings to the database
    await Training.insertMany(trainings);
  } catch (error) {
    console.error('Error initializing trainings:', error);
    throw error;
  }
};
