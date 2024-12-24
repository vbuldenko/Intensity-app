import { schedule } from '../data/predefined_schedule';
import Schedule, { ISchedule } from '../db/models/schedule';
import Training from '../db/models/training';
import { startOfWeek, addDays, set, endOfWeek } from 'date-fns';
import { toZonedTime, format } from 'date-fns-tz';
import scheduleService from '../services/schedule.service';
import { ApiError } from '../exceptions/api.error';

export async function initializePredefinedSchedule() {
  const daysOfWeek = Object.keys(schedule); // ['Monday', 'Tuesday', ...]

  // Create trainings for each day of the week
  const trainings = daysOfWeek
    .map(day => {
      return schedule[day as keyof typeof schedule].map(
        (session: ISchedule) => ({
          type: session.type,
          instructor: session.instructor,
          maxCapacity: session.maxCapacity,
          day,
          time: session.time,
        }),
      );
    })
    .flat();

  // Save trainings to the database
  await Schedule.insertMany(trainings);
}

export async function initializeTrainingsForWeek(
  day?: number,
  month?: number,
  year?: number,
) {
  const now = new Date();
  const providedDate = new Date(
    year ?? now.getFullYear(),
    (month ?? now.getMonth() + 1) - 1, // month is 0-indexed
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

      // Convert the trainingDate to the specified time zone
      const timeZone = 'Europe/Kiev';
      const trainingDateZoned = toZonedTime(trainingDate, timeZone);
      // Format the date to UTC
      const trainingDateUtc = format(
        trainingDateZoned,
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
        { timeZone: 'UTC' },
      );

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
}
