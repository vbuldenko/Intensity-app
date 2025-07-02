import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Schedule, ScheduleDocument } from './schemas/schedule.schema';
import {
  CreateScheduleDto,
  UpdateScheduleDto,
  ScheduleResponseDto,
} from './dto/schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
  ) {}

  private mapToResponseDto = (
    schedule: ScheduleDocument,
  ): ScheduleResponseDto => {
    const currentTime = new Date().toISOString();
    const docWithTimestamps = schedule as ScheduleDocument & {
      createdAt?: Date;
      updatedAt?: Date;
    };

    return {
      id: String(schedule._id),
      day: schedule.day,
      time: schedule.time,
      type: schedule.type,
      instructor: String(schedule.instructor),
      maxCapacity: schedule.maxCapacity,
      createdAt: docWithTimestamps.createdAt?.toISOString() || currentTime,
      updatedAt: docWithTimestamps.updatedAt?.toISOString() || currentTime,
    };
  };

  create = async (
    scheduleData: CreateScheduleDto,
  ): Promise<ScheduleResponseDto> => {
    const scheduleDoc = {
      ...scheduleData,
      instructor: new Types.ObjectId(scheduleData.instructor),
    };

    const schedule = new this.scheduleModel(scheduleDoc);
    const savedSchedule = await schedule.save();
    return this.mapToResponseDto(savedSchedule);
  };

  findAll = async (): Promise<ScheduleResponseDto[]> => {
    const schedules = await this.scheduleModel
      .find()
      .populate('instructor')
      .exec();
    return schedules.map(this.mapToResponseDto);
  };

  findById = async (id: string): Promise<ScheduleResponseDto> => {
    const schedule = await this.scheduleModel
      .findById(id)
      .populate('instructor')
      .exec();

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    return this.mapToResponseDto(schedule);
  };

  update = async (
    id: string,
    scheduleData: UpdateScheduleDto,
  ): Promise<ScheduleResponseDto> => {
    const updateDoc = {
      ...scheduleData,
      ...(scheduleData.instructor && {
        instructor: new Types.ObjectId(scheduleData.instructor),
      }),
    };

    const schedule = await this.scheduleModel
      .findByIdAndUpdate(id, updateDoc, { new: true })
      .populate('instructor')
      .exec();

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    return this.mapToResponseDto(schedule);
  };

  delete = async (id: string): Promise<ScheduleResponseDto> => {
    const schedule = await this.scheduleModel.findByIdAndDelete(id).exec();

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    return this.mapToResponseDto(schedule);
  };

  findByDay = async (day: string): Promise<ScheduleResponseDto[]> => {
    const schedules = await this.scheduleModel
      .find({ day })
      .populate('instructor')
      .exec();
    return schedules.map(this.mapToResponseDto);
  };

  findByInstructor = async (
    instructorId: string,
  ): Promise<ScheduleResponseDto[]> => {
    const schedules = await this.scheduleModel
      .find({ instructor: instructorId })
      .populate('instructor')
      .exec();
    return schedules.map(this.mapToResponseDto);
  };
}
