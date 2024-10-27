import db from '../db/models';
import { ApiError } from '../exceptions/api.error';

class ScheduleService {
  async createOne(scheduleData: {
    day: string;
    time: string;
    type: string;
    maxCapacity: number;
    instructorId?: number;
  }) {
    return await db.Schedule.create(scheduleData);
  }

  async getAll() {
    return await db.Schedule.findAll();
  }

  async getOneById(id: number) {
    return await db.Schedule.findByPk(id);
  }

  async updateOne(
    id: number,
    scheduleData: Partial<{
      day: string;
      time: string;
      type: string;
      maxCapacity: number;
      instructorId: number;
    }>,
  ) {
    const session = await this.getOneById(id);
    if (session) {
      return await session.update(scheduleData);
    }
    throw ApiError.NotFound({
      error: 'Training session not found',
    });
  }

  async deleteOne(id: number) {
    const session = await this.getOneById(id);
    if (session) {
      return await session.destroy();
    }
    throw ApiError.NotFound({
      error: 'Training session not found',
    });
  }
}

export default new ScheduleService();
