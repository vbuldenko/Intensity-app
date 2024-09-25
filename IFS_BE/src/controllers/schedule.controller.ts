// src/controllers/schedule.controller.ts
import { Request, Response } from 'express';
import scheduleService from '../services/schedule.service';
import { UserDTO } from '../types/UserDTO';
import { ApiError } from '../exceptions/api.error';

class ScheduleController {
  // Create a new training session
  async createOne(req: Request, res: Response) {
    const scheduleData = req.body;
    const user = req.user as UserDTO;

    if (!user || user.role !== 'admin') {
      throw ApiError.Unauthorized();
    }

    const newSchedule = await scheduleService.createOne(scheduleData);
    res.status(201).json(newSchedule);
  }

  // Get all training sessions
  async getAll(req: Request, res: Response) {
    const schedules = await scheduleService.getAll();
    res.status(200).json(schedules);
  }

  // Get a schedule by ID
  async getOneById(req: Request, res: Response) {
    const { id } = req.params;
    const schedule = await scheduleService.getOneById(Number(id));
    if (schedule) {
      res.status(200).json(schedule);
    } else {
      throw ApiError.NotFound({ session: 'Not found' });
    }
  }

  // Update a training session
  async updateOne(req: Request, res: Response) {
    const { id } = req.params;
    const user = req.user as UserDTO;

    if (!user || user.role !== 'admin') {
      throw ApiError.Unauthorized();
    }
    const updatedSchedule = await scheduleService.updateOne(
      Number(id),
      req.body,
    );
    res.status(200).json(updatedSchedule);
  }

  // Delete a training session
  async deleteOne(req: Request, res: Response) {
    const { id } = req.params;
    const user = req.user as UserDTO;

    if (!user || user.role !== 'admin') {
      throw ApiError.Unauthorized();
    }
    await scheduleService.deleteOne(Number(id));
    res.status(204).end();
  }
}

export default new ScheduleController();
