import { Request, Response } from 'express';
import scheduleService from '../services/schedule.service';
import { ApiError } from '../exceptions/api.error';
import { getUserFromRequest } from '../utils';

class ScheduleController {
  async createOne(req: Request, res: Response) {
    const user = getUserFromRequest(req);
    if (user.role !== 'admin') {
      throw ApiError.Unauthorized();
    }
    const scheduleData = req.body;
    const newSchedule = await scheduleService.createOne(scheduleData);
    res.status(201).json(newSchedule);
  }

  async getAll(req: Request, res: Response) {
    const schedules = await scheduleService.getAll();
    res.status(200).json(schedules);
  }

  async getOneById(req: Request, res: Response) {
    const { id } = req.params;
    const schedule = await scheduleService.getOneById(Number(id));
    if (schedule) {
      res.status(200).json(schedule);
    } else {
      throw ApiError.NotFound({ session: 'Not found' });
    }
  }

  async updateOne(req: Request, res: Response) {
    const user = getUserFromRequest(req);
    if (user.role !== 'admin') {
      throw ApiError.Unauthorized();
    }
    const { id } = req.params;
    const updatedSchedule = await scheduleService.updateOne(
      Number(id),
      req.body,
    );
    res.status(200).json(updatedSchedule);
  }

  async deleteOne(req: Request, res: Response) {
    const user = getUserFromRequest(req);
    if (user.role !== 'admin') {
      throw ApiError.Unauthorized();
    }
    const { id } = req.params;
    await scheduleService.deleteOne(Number(id));
    res.status(204).end();
  }
}

export default new ScheduleController();
