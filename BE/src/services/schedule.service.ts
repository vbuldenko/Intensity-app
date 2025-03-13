import Schedule, { ISchedule } from '../db/models/schedule';
import { ApiError } from '../exceptions/api.error';
import { schedule } from '../data/predefined_schedule';

class ScheduleService {
  async createOne(scheduleData: {
    day: string;
    time: string;
    type: string;
    maxCapacity: number;
    instructor?: string;
  }) {
    const newSchedule = new Schedule(scheduleData);
    await newSchedule.save();
    return newSchedule;
  }

  async getAll() {
    return await Schedule.find().populate({
      path: 'instructor',
      select: 'firstName lastName',
    });
  }

  async getOneById(id: string) {
    return await Schedule.findById(id);
  }

  async updateOne(
    id: string,
    scheduleData: Partial<{
      day: string;
      time: string;
      type: string;
      maxCapacity: number;
      instructor: string;
    }>,
  ) {
    const session = await this.getOneById(id);
    if (session) {
      Object.assign(session, scheduleData);
      await session.save();
      return session.populate({
        path: 'instructor',
        select: 'firstName lastName',
      });
    }
    throw ApiError.NotFound({
      error: 'Training session not found',
    });
  }

  async deleteOne(id: string) {
    const session = await this.getOneById(id);
    if (session) {
      await session.deleteOne();
      return session;
    }
    throw ApiError.NotFound({
      error: 'Training session not found',
    });
  }

  async initializePredefinedSchedule() {
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
}

export default new ScheduleService();
