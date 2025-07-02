import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';
import {
  CreateReservationDto,
  UpdateReservationDto,
  ReservationResponseDto,
  ReservationQueryDto,
} from './dto/reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
  ) {}

  create = async (
    createReservationDto: CreateReservationDto,
  ): Promise<ReservationResponseDto> => {
    this.validateObjectId(createReservationDto.training);
    this.validateObjectId(createReservationDto.user);
    this.validateObjectId(createReservationDto.abonement);

    // Check if reservation already exists
    const existingReservation = await this.reservationModel.findOne({
      training: createReservationDto.training,
      user: createReservationDto.user,
      status: 'active',
    });

    if (existingReservation) {
      throw new ConflictException(
        'User already has an active reservation for this training',
      );
    }

    const createdReservation = new this.reservationModel(createReservationDto);
    const savedReservation = await createdReservation.save();

    return this.mapToResponseDto(savedReservation);
  };

  findAll = async (): Promise<ReservationResponseDto[]> => {
    const reservations = await this.reservationModel
      .find()
      .populate('training', 'type date time format capacity')
      .populate('user', 'firstName lastName email')
      .populate('abonement', 'type status left')
      .exec();

    return reservations.map((reservation) =>
      this.mapToResponseDto(reservation),
    );
  };

  findOne = async (id: string): Promise<ReservationResponseDto> => {
    this.validateObjectId(id);

    const reservation = await this.reservationModel
      .findById(id)
      .populate('training', 'type date time format capacity')
      .populate('user', 'firstName lastName email')
      .populate('abonement', 'type status left')
      .exec();

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    return this.mapToResponseDto(reservation);
  };

  findByUser = async (userId: string): Promise<ReservationResponseDto[]> => {
    this.validateObjectId(userId);

    const reservations = await this.reservationModel
      .find({ user: userId })
      .populate('training', 'type date time format capacity')
      .populate('user', 'firstName lastName email')
      .populate('abonement', 'type status left')
      .exec();

    return reservations.map((reservation) =>
      this.mapToResponseDto(reservation),
    );
  };

  findByTraining = async (
    trainingId: string,
  ): Promise<ReservationResponseDto[]> => {
    this.validateObjectId(trainingId);

    const reservations = await this.reservationModel
      .find({ training: trainingId })
      .populate('training', 'type date time format capacity')
      .populate('user', 'firstName lastName email')
      .populate('abonement', 'type status left')
      .exec();

    return reservations.map((reservation) =>
      this.mapToResponseDto(reservation),
    );
  };

  findByStatus = async (status: string): Promise<ReservationResponseDto[]> => {
    const reservations = await this.reservationModel
      .find({ status })
      .populate('training', 'type date time format capacity')
      .populate('user', 'firstName lastName email')
      .populate('abonement', 'type status left')
      .exec();

    return reservations.map((reservation) =>
      this.mapToResponseDto(reservation),
    );
  };

  update = async (
    id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<ReservationResponseDto> => {
    this.validateObjectId(id);

    if (updateReservationDto.training) {
      this.validateObjectId(updateReservationDto.training);
    }
    if (updateReservationDto.user) {
      this.validateObjectId(updateReservationDto.user);
    }
    if (updateReservationDto.abonement) {
      this.validateObjectId(updateReservationDto.abonement);
    }

    const updatedReservation = await this.reservationModel
      .findByIdAndUpdate(id, updateReservationDto, {
        new: true,
        runValidators: true,
      })
      .populate('training', 'type date time format capacity')
      .populate('user', 'firstName lastName email')
      .populate('abonement', 'type status left')
      .exec();

    if (!updatedReservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    return this.mapToResponseDto(updatedReservation);
  };

  remove = async (id: string): Promise<void> => {
    this.validateObjectId(id);

    const result = await this.reservationModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
  };

  // Business logic methods
  cancelReservation = async (id: string): Promise<ReservationResponseDto> => {
    const reservation = await this.update(id, {
      status: 'cancelled',
    });

    return reservation;
  };

  activateReservation = async (id: string): Promise<ReservationResponseDto> => {
    const reservation = await this.update(id, {
      status: 'active',
    });

    return reservation;
  };

  // Alias and additional methods for controller compatibility
  createReservation = this.create;
  findAllReservations = async (
    query?: ReservationQueryDto,
  ): Promise<ReservationResponseDto[]> => {
    const filter: Record<string, unknown> = {};
    if (query?.status) filter.status = query.status;
    if (query?.userId) filter.user = query.userId;
    if (query?.trainerId) filter.trainer = query.trainerId;

    const reservations = await this.reservationModel
      .find(filter)
      .populate('training')
      .populate('user')
      .populate('abonement')
      .exec();
    return reservations.map(this.mapToResponseDto);
  };

  findUserReservations = async (
    userId: string,
    query?: ReservationQueryDto,
  ): Promise<ReservationResponseDto[]> => {
    const filter: Record<string, unknown> = { user: userId };
    if (query?.status) filter.status = query.status;

    const reservations = await this.reservationModel
      .find(filter)
      .populate('training')
      .populate('user')
      .populate('abonement')
      .exec();
    return reservations.map(this.mapToResponseDto);
  };

  getUpcomingReservations = async (
    userId: string,
    limit?: number,
  ): Promise<ReservationResponseDto[]> => {
    const query = this.reservationModel
      .find({ user: userId, status: 'active' })
      .populate('training')
      .populate('user')
      .populate('abonement')
      .sort({ createdAt: 1 });

    if (limit) query.limit(limit);

    const reservations = await query.exec();
    return reservations.map(this.mapToResponseDto);
  };

  findTrainerReservations = async (
    trainerId: string,
    query?: ReservationQueryDto,
  ): Promise<ReservationResponseDto[]> => {
    const filter: Record<string, unknown> = { trainer: trainerId };
    if (query?.status) filter.status = query.status;

    const reservations = await this.reservationModel
      .find(filter)
      .populate('training')
      .populate('user')
      .populate('abonement')
      .exec();
    return reservations.map(this.mapToResponseDto);
  };

  getReservationStats = async (
    userId?: string,
    trainerId?: string,
  ): Promise<Record<string, unknown>> => {
    const filter: Record<string, unknown> = {};
    if (userId) filter.user = userId;
    if (trainerId) filter.trainer = trainerId;

    const stats = await this.reservationModel.aggregate([
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

  findReservationById = this.findOne;
  updateReservation = this.update;

  markAsAttended = async (id: string): Promise<ReservationResponseDto> => {
    return this.update(id, { status: 'completed' });
  };

  addFeedback = async (
    id: string,
    feedbackDto: { rating: string; comment?: string },
  ): Promise<ReservationResponseDto> => {
    return this.update(id, {
      feedback: {
        rating: parseInt(feedbackDto.rating),
        comment: feedbackDto.comment,
      },
    });
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
    reservation: ReservationDocument,
  ): ReservationResponseDto => {
    return {
      id: reservation.id,
      training: reservation.training.toString(),
      user: reservation.user.toString(),
      abonement: reservation.abonement.toString(),
      status: reservation.status,
      createdAt: (reservation as any).createdAt,
      updatedAt: (reservation as any).updatedAt,
    };
  };
}
