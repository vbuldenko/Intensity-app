import Schedule, { ISchedule } from '../db/models/schedule';
import { ApiError } from '../exceptions/api.error';

class ScheduleService {
  async createOne(scheduleData: {
    day: string;
    time: string;
    type: string;
    maxCapacity: number;
    instructorId?: string;
  }) {
    const newSchedule = new Schedule(scheduleData);
    await newSchedule.save();
    return newSchedule;
  }

  async getAll() {
    return await Schedule.find();
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
      instructorId: string;
    }>,
  ) {
    const session = await this.getOneById(id);
    if (session) {
      Object.assign(session, scheduleData);
      await session.save();
      return session;
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
}

export default new ScheduleService();
