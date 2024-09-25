import { schedule } from '../data/predefined_schedule';
import db from '../db/models';
// import { Trainers } from '../types/Trainers';
import { startOfWeek, addDays, set } from 'date-fns';
import { ScheduleTraining } from '../types/ScheduleTraining';
import scheduleService from '../services/schedule.service';

export async function initializePredefinedSchedule() {
  const daysOfWeek = Object.keys(schedule); // ['Monday', 'Tuesday', ...]

  // Create trainings for each day of the week
  const trainings = daysOfWeek
    .map(day => {
      return schedule[day as keyof typeof schedule].map(
        (session: ScheduleTraining) => ({
          type: session.type,
          instructorId: session.instructorId,
          capacity: session.maxCapacity,
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
  const startDate = startOfWeek(providedDate, { weekStartsOn: 1 });

  try {
    // Fetch training data from scheduleService
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
      const trainingDate = addDays(startDate, dayIndex);

      return {
        type: session.type,
        instructorId: session.instructorId,
        capacity: session.maxCapacity,
        date: trainingDate,
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
