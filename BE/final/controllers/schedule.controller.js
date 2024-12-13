import scheduleService from '../services/schedule.service.js';
import { ApiError } from '../exceptions/api.error.js';
import { getUserFromRequest } from '../utils/index.js';
class ScheduleController {
  async createOne(req, res) {
    const user = getUserFromRequest(req);
    if (user.role !== 'admin') {
      throw ApiError.Unauthorized();
    }
    const scheduleData = req.body;
    const newSchedule = await scheduleService.createOne(scheduleData);
    res.status(201).json(newSchedule);
  }
  async getAll(req, res) {
    const schedules = await scheduleService.getAll();
    res.status(200).json(schedules);
  }
  async getOneById(req, res) {
    const { id } = req.params;
    const schedule = await scheduleService.getOneById(id);
    if (schedule) {
      res.status(200).json(schedule);
    } else {
      throw ApiError.NotFound({ session: 'Not found' });
    }
  }
  async updateOne(req, res) {
    const user = getUserFromRequest(req);
    if (user.role !== 'admin') {
      throw ApiError.Unauthorized();
    }
    const { id } = req.params;
    const updatedSchedule = await scheduleService.updateOne(id, req.body);
    res.status(200).json(updatedSchedule);
  }
  async deleteOne(req, res) {
    const user = getUserFromRequest(req);
    if (user.role !== 'admin') {
      throw ApiError.Unauthorized();
    }
    const { id } = req.params;
    await scheduleService.deleteOne(id);
    res.status(204).end();
  }
}
export default new ScheduleController();
