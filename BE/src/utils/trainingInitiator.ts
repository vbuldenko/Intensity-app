import { schedule } from '../data/predefined_schedule';
import db from '../db/models';
// import { Trainers } from '../types/Trainers';
import { startOfWeek, addDays, set, endOfWeek } from 'date-fns';
import { ScheduleTraining } from '../types/ScheduleTraining';
import scheduleService from '../services/schedule.service';
import { ApiError } from '../exceptions/api.error';

export async function initializePredefinedSchedule() {
  const daysOfWeek = Object.keys(schedule); // ['Monday', 'Tuesday', ...]

  // Create trainings for each day of the week
  const trainings = daysOfWeek
    .map(day => {
      return schedule[day as keyof typeof schedule].map(
        (session: ScheduleTraining) => ({
          type: session.type,
          instructorId: session.instructorId,
          maxCapacity: session.maxCapacity,
          day,
          time: session.time,
        }),
      );
    })
    .flat();

  // Save trainings to the database
  await db.Schedule.bulkCreate(trainings);
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
  }).toISOString(); //To avoid sequelize date type error
  const endDate = endOfWeek(providedDate, { weekStartsOn: 1 }).toISOString();

  try {
    const existingTrainings = await db.Training.findOne({
      where: {
        date: {
          [db.Sequelize.Op.between]: [startDate, endDate],
        },
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
    const trainings = scheduleTrainings.map((session: ScheduleTraining) => {
      const dayIndex = daysOfWeek.indexOf(session.day);
      const hours = Number(session.time.slice(0, 2));
      let trainingDate = addDays(startDate, dayIndex);
      trainingDate.setHours(hours, 0, 0, 0);

      return {
        type: session.type,
        instructorId: session.instructorId,
        capacity: session.maxCapacity,
        date: trainingDate.toISOString(),
        day: session.day,
        time: session.time,
      };
    });

    // Save trainings to the database
    await db.Training.bulkCreate(trainings);
  } catch (error) {
    console.error('Error initializing trainings:', error);
    throw error;
  }
}
