import { schedule } from '../data/predefined_schedule.js';
import Schedule from '../db/models/Schedule.js';
import { ApiError } from '../exceptions/api.error.js';
class ScheduleService {
  async createOne(scheduleData) {
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
  async getOneById(id) {
    return await Schedule.findById(id);
  }
  async updateOne(id, scheduleData) {
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
  async deleteOne(id) {
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
    const daysOfWeek = Object.keys(schedule);

    const trainings = daysOfWeek
      .map(day => {
        return schedule[day].map(session => ({
          type: session.type,
          instructor: session.instructor,
          maxCapacity: session.maxCapacity,
          day,
          time: session.time,
        }));
      })
      .flat();

    await Schedule.insertMany(trainings);
  }
}
export default new ScheduleService();
