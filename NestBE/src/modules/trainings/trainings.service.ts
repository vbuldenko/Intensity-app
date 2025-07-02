import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Training, TrainingDocument } from './schemas/training.schema';
import {
  CreateTrainingDto,
  UpdateTrainingDto,
  TrainingResponseDto,
  TrainingQueryDto,
} from './dto/training.dto';

@Injectable()
export class TrainingsService {
  constructor(
    @InjectModel(Training.name)
    private trainingModel: Model<TrainingDocument>,
  ) {}

  create = async (
    createTrainingDto: CreateTrainingDto,
  ): Promise<TrainingResponseDto> => {
    this.validateObjectId(createTrainingDto.instructor);

    const createdTraining = new this.trainingModel(createTrainingDto);
    const savedTraining = await createdTraining.save();

    return this.mapToResponseDto(savedTraining);
  };

  findAll = async (): Promise<TrainingResponseDto[]> => {
    const trainings = await this.trainingModel
      .find()
      .populate('instructor', 'firstName lastName email')
      .populate('reservations')
      .exec();

    return trainings.map((training) => this.mapToResponseDto(training));
  };

  findOne = async (id: string): Promise<TrainingResponseDto> => {
    this.validateObjectId(id);

    const training = await this.trainingModel
      .findById(id)
      .populate('instructor', 'firstName lastName email')
      .populate('reservations')
      .exec();

    if (!training) {
      throw new NotFoundException(`Training with ID ${id} not found`);
    }

    return this.mapToResponseDto(training);
  };

  findByInstructor = async (
    instructorId: string,
  ): Promise<TrainingResponseDto[]> => {
    this.validateObjectId(instructorId);

    const trainings = await this.trainingModel
      .find({ instructor: instructorId })
      .populate('instructor', 'firstName lastName email')
      .populate('reservations')
      .exec();

    return trainings.map((training) => this.mapToResponseDto(training));
  };

  findByDay = async (day: string): Promise<TrainingResponseDto[]> => {
    const trainings = await this.trainingModel
      .find({ day })
      .populate('instructor', 'firstName lastName email')
      .populate('reservations')
      .exec();

    return trainings.map((training) => this.mapToResponseDto(training));
  };

  findByDateRange = async (
    startDate: Date,
    endDate: Date,
  ): Promise<TrainingResponseDto[]> => {
    const trainings = await this.trainingModel
      .find({
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .populate('instructor', 'firstName lastName email')
      .populate('reservations')
      .exec();

    return trainings.map((training) => this.mapToResponseDto(training));
  };

  update = async (
    id: string,
    updateTrainingDto: UpdateTrainingDto,
  ): Promise<TrainingResponseDto> => {
    this.validateObjectId(id);

    if (updateTrainingDto.instructor) {
      this.validateObjectId(updateTrainingDto.instructor);
    }

    const updatedTraining = await this.trainingModel
      .findByIdAndUpdate(id, updateTrainingDto, {
        new: true,
        runValidators: true,
      })
      .populate('instructor', 'firstName lastName email')
      .populate('reservations')
      .exec();

    if (!updatedTraining) {
      throw new NotFoundException(`Training with ID ${id} not found`);
    }

    return this.mapToResponseDto(updatedTraining);
  };

  remove = async (id: string): Promise<void> => {
    this.validateObjectId(id);

    const result = await this.trainingModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Training with ID ${id} not found`);
    }
  };

  // Business logic methods
  cancelTraining = async (id: string): Promise<TrainingResponseDto> => {
    const training = await this.update(id, {
      isCancelled: true,
    });

    return training;
  };

  uncancelTraining = async (id: string): Promise<TrainingResponseDto> => {
    const training = await this.update(id, {
      isCancelled: false,
    });

    return training;
  };

  getAvailableSpots = async (id: string): Promise<number> => {
    this.validateObjectId(id);

    const training = await this.trainingModel
      .findById(id)
      .populate('reservations')
      .exec();

    if (!training) {
      throw new NotFoundException(`Training with ID ${id} not found`);
    }

    const reservedSpots = training.reservations?.length || 0;
    return Math.max(0, training.capacity - reservedSpots);
  };

  // Alias and additional methods for controller compatibility
  createTraining = this.create;
  findAllTrainings = async (
    query?: TrainingQueryDto,
  ): Promise<TrainingResponseDto[]> => {
    const filter: Record<string, unknown> = {};
    if (query?.status) filter.status = query.status;
    if (query?.instructorId) filter.instructor = query.instructorId;
    if (query?.type) filter.type = query.type;

    const trainings = await this.trainingModel
      .find(filter)
      .populate('instructor')
      .exec();
    return trainings.map(this.mapToResponseDto);
  };

  getUpcomingTrainings = async (
    limit?: number,
  ): Promise<TrainingResponseDto[]> => {
    const query = this.trainingModel
      .find({ status: 'scheduled' })
      .populate('instructor')
      .sort({ dateTime: 1 });

    if (limit) query.limit(limit);

    const trainings = await query.exec();
    return trainings.map(this.mapToResponseDto);
  };

  getTrainingStats = async (
    trainerId?: string,
  ): Promise<Record<string, unknown>> => {
    const filter: Record<string, unknown> = {};
    if (trainerId) filter.instructor = trainerId;

    const stats = await this.trainingModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    return stats.reduce(
      (acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      },
      {} as Record<string, unknown>,
    );
  };

  findTrainerTrainings = async (
    trainerId: string,
    query?: TrainingQueryDto,
  ): Promise<TrainingResponseDto[]> => {
    const filter: Record<string, unknown> = { instructor: trainerId };
    if (query?.status) filter.status = query.status;
    if (query?.type) filter.type = query.type;

    const trainings = await this.trainingModel
      .find(filter)
      .populate('instructor')
      .exec();
    return trainings.map(this.mapToResponseDto);
  };

  findTrainingById = this.findOne;
  updateTraining = this.update;
  removeTraining = this.remove;
  completeTraining = async (id: string): Promise<TrainingResponseDto> => {
    return this.update(id, { status: 'completed' });
  };

  checkTrainerAvailability = async (
    trainerId: string,
    startTime: Date,
    endTime: Date,
    excludeTrainingId?: string,
  ): Promise<boolean> => {
    const query: Record<string, unknown> = {
      instructor: trainerId,
      $or: [
        {
          dateTime: {
            $gte: startTime,
            $lt: endTime,
          },
        },
        {
          $and: [
            { dateTime: { $lte: startTime } },
            {
              $expr: {
                $gt: [
                  { $add: ['$dateTime', { $multiply: ['$duration', 60000] }] },
                  startTime,
                ],
              },
            },
          ],
        },
      ],
      status: { $ne: 'cancelled' },
    };

    if (excludeTrainingId) {
      query._id = { $ne: excludeTrainingId };
    }

    const conflictingTrainings = await this.trainingModel.find(query).exec();

    return conflictingTrainings.length === 0;
  };

  // Helper methods
  private validateObjectId = (id: string): void => {
    try {
      new Types.ObjectId(id);
    } catch {
      throw new BadRequestException('Invalid ObjectId format');
    }
  };

  private mapToResponseDto = (
    training: TrainingDocument,
  ): TrainingResponseDto => {
    return {
      id: training.id,
      type: training.type,
      format: training.format,
      instructor: training.instructor.toString(),
      capacity: training.capacity,
      date: training.date,
      day: training.day,
      time: training.time,
      reservations: training.reservations?.map((id) => id.toString()) || [],
      isCancelled: training.isCancelled,
      createdAt: (training as any).createdAt,
      updatedAt: (training as any).updatedAt,
    };
  };
}
