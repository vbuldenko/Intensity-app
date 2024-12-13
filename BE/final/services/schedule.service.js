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
}
export default new ScheduleService();
