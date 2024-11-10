import { schedule } from '../data/predefined_schedule';
import Schedule from '../db/models/Schedule';
import Training from '../db/models/Training';
import { startOfWeek, addDays, endOfWeek } from 'date-fns';
import scheduleService from '../services/schedule.service';
import { ApiError } from '../exceptions/api.error';
export async function initializePredefinedSchedule() {
    const daysOfWeek = Object.keys(schedule); // ['Monday', 'Tuesday', ...]
    // Create trainings for each day of the week
    const trainings = daysOfWeek
        .map(day => {
        return schedule[day].map((session) => ({
            type: session.type,
            instructorId: session.instructorId,
            maxCapacity: session.maxCapacity,
            day,
            time: session.time,
        }));
    })
        .flat();
    // Save trainings to the database
    await Schedule.insertMany(trainings);
}
export async function initializeTrainingsForWeek(day, month, year) {
    const now = new Date();
    const providedDate = new Date(year ?? now.getFullYear(), (month ?? now.getMonth() + 1) - 1, // month is 0-indexed
    day ?? now.getDate());
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
            return {
                type: session.type,
                instructor: session.instructorId,
                capacity: session.maxCapacity,
                date: trainingDate.toISOString(),
                day: session.day,
                time: session.time,
            };
        });
        // Save trainings to the database
        await Training.insertMany(trainings);
    }
    catch (error) {
        console.error('Error initializing trainings:', error);
        throw error;
    }
}
