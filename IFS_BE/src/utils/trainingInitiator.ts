import { schedule } from '../data/predefined_schedule';
import db from '../db/models';
// import { Trainers } from '../types/Trainers';
import { startOfWeek, addDays, set } from 'date-fns';

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

  const daysOfWeek = Object.keys(schedule); // ['Monday', 'Tuesday', ...]

  // Create trainings for each day of the week
  const trainings = daysOfWeek
    .map((day, index) => {
      const trainingDate = addDays(startDate, index); // Adjust the date based on start date and index

      return schedule[day as keyof typeof schedule].map(session => ({
        type: session.type,
        instructorId: session.instructorId,
        capacity: session.maxCapacity,
        date: trainingDate,
        day,
        time: session.time,
      }));
    })
    .flat();

  // Save trainings to the database
  await db.Training.bulkCreate(trainings);
}
