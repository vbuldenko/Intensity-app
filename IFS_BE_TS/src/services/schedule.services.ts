import db from '../db/models';
import { ApiError } from '../exceptions/api.error';

class ScheduleService {
  // Create a new training session
  async createOne(scheduleData: {
    day: string;
    time: string;
    type: string;
    maxCapacity: number;
    instructorId?: number;
  }) {
    return await db.Schedule.create(scheduleData);
  }

  // Get all training sessions
  async getAll() {
    return await db.Schedule.findAll();
  }

  // Get a schedule by ID
  async getOneById(id: number) {
    return await db.Schedule.findByPk(id);
  }

  // Update a training session
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

  // Delete a training session
  async deleteSchedule(id: number) {
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
