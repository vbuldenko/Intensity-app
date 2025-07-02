import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Abonement, AbonementDocument } from './schemas/abonement.schema';
import {
  CreateAbonementDto,
  UpdateAbonementDto,
  AbonementResponseDto,
} from './dto/abonement.dto';

@Injectable()
export class AbonementsService {
  constructor(
    @InjectModel(Abonement.name)
    private abonementModel: Model<AbonementDocument>,
  ) {}

  create = async (
    createAbonementDto: CreateAbonementDto,
  ): Promise<AbonementResponseDto> => {
    this.validateObjectId(createAbonementDto.user);

    const createdAbonement = new this.abonementModel(createAbonementDto);
    const savedAbonement = await createdAbonement.save();

    return this.mapToResponseDto(savedAbonement);
  };

  findAll = async (): Promise<AbonementResponseDto[]> => {
    const abonements = await this.abonementModel
      .find()
      .populate('user', 'firstName lastName email')
      .populate('reservations')
      .exec();

    return abonements.map((abonement) => this.mapToResponseDto(abonement));
  };

  findOne = async (id: string): Promise<AbonementResponseDto> => {
    this.validateObjectId(id);

    const abonement = await this.abonementModel
      .findById(id)
      .populate('user', 'firstName lastName email')
      .populate('reservations')
      .exec();

    if (!abonement) {
      throw new NotFoundException(`Abonement with ID ${id} not found`);
    }

    return this.mapToResponseDto(abonement);
  };

  findByUser = async (userId: string): Promise<AbonementResponseDto[]> => {
    this.validateObjectId(userId);

    const abonements = await this.abonementModel
      .find({ user: userId })
      .populate('user', 'firstName lastName email')
      .populate('reservations')
      .exec();

    return abonements.map((abonement) => this.mapToResponseDto(abonement));
  };

  findByStatus = async (status: string): Promise<AbonementResponseDto[]> => {
    const abonements = await this.abonementModel
      .find({ status })
      .populate('user', 'firstName lastName email')
      .populate('reservations')
      .exec();

    return abonements.map((abonement) => this.mapToResponseDto(abonement));
  };

  update = async (
    id: string,
    updateAbonementDto: UpdateAbonementDto,
  ): Promise<AbonementResponseDto> => {
    this.validateObjectId(id);

    const updatedAbonement = await this.abonementModel
      .findByIdAndUpdate(id, updateAbonementDto, {
        new: true,
        runValidators: true,
      })
      .populate('user', 'firstName lastName email')
      .populate('reservations')
      .exec();

    if (!updatedAbonement) {
      throw new NotFoundException(`Abonement with ID ${id} not found`);
    }

    return this.mapToResponseDto(updatedAbonement);
  };

  remove = async (id: string): Promise<void> => {
    this.validateObjectId(id);

    const result = await this.abonementModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Abonement with ID ${id} not found`);
    }
  };

  // Business logic methods
  activateAbonement = async (id: string): Promise<AbonementResponseDto> => {
    const abonement = await this.update(id, {
      status: 'active',
      activatedAt: new Date(),
    });

    return abonement;
  };

  expireAbonement = async (id: string): Promise<AbonementResponseDto> => {
    const abonement = await this.update(id, {
      status: 'expired',
      expiratedAt: new Date().toISOString(),
    });

    return abonement;
  };

  useSession = async (id: string): Promise<AbonementResponseDto> => {
    this.validateObjectId(id);

    const abonement = await this.abonementModel.findById(id).exec();
    if (!abonement) {
      throw new NotFoundException(`Abonement with ID ${id} not found`);
    }

    if (abonement.left <= 0) {
      throw new BadRequestException('No sessions left in this abonement');
    }

    const updatedAbonement = await this.abonementModel
      .findByIdAndUpdate(
        id,
        {
          $inc: { left: -1 },
          ...(abonement.left === 1 && { status: 'ended' }),
        },
        { new: true, runValidators: true },
      )
      .populate('user', 'firstName lastName email')
      .populate('reservations')
      .exec();

    if (!updatedAbonement) {
      throw new NotFoundException(`Abonement with ID ${id} not found`);
    }

    return this.mapToResponseDto(updatedAbonement);
  };

  // Alias methods for controller compatibility
  createAbonement = this.create;
  findAllAbonements = this.findAll;
  findAbonementById = this.findOne;
  updateAbonement = this.update;
  removeAbonement = this.remove;

  // Additional methods for controller
  getAbonementStats = async (): Promise<Record<string, number>> => {
    type Stat = { _id: string; count: number };
    const stats: Stat[] = await this.abonementModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    return stats.reduce((acc: Record<string, number>, stat: Stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});
  };

  purchaseAbonement = async (
    userId: string,
    purchaseDto: {
      abonementId: string;
      paymentMethod: 'card' | 'cash';
      notes?: string;
    },
  ): Promise<AbonementResponseDto> => {
    const createDto: CreateAbonementDto = {
      user: userId,
      status: 'active' as const,
      type: 'group' as const, // Default type, should be determined by abonement template
      amount: 10, // Default, should come from abonement template
      left: 10,
      price: 0, // Should come from abonement template
      paymentMethod: purchaseDto.paymentMethod,
    };

    return this.create(createDto);
  };

  findUserAbonements = this.findByUser;

  findActiveUserAbonement = async (
    userId: string,
  ): Promise<AbonementResponseDto | null> => {
    const abonements = await this.findByUser(userId);
    const activeAbonement = abonements.find((ab) => ab.status === 'active');
    return activeAbonement || null;
  };

  updateUserAbonement = this.update;

  suspendAbonement = async (
    id: string,
    reason?: string,
  ): Promise<AbonementResponseDto> => {
    return this.update(id, {
      status: 'inactive',
      notes: reason ? `Suspended: ${reason}` : 'Suspended',
    });
  };

  reactivateAbonement = this.activateAbonement;

  // Helper methods
  private validateObjectId = (id: string): void => {
    try {
      new Types.ObjectId(id);
    } catch {
      throw new BadRequestException('Invalid ObjectId format');
    }
  };

  private mapToResponseDto = (
    abonement: AbonementDocument,
  ): AbonementResponseDto => {
    const docWithTimestamps = abonement as AbonementDocument & {
      createdAt?: Date;
      updatedAt?: Date;
    };

    return {
      id: String(abonement._id),
      user: abonement.user.toString(),
      status: abonement.status,
      type: abonement.type,
      amount: abonement.amount,
      price: abonement.price,
      left: abonement.left,
      activatedAt: abonement.activatedAt,
      expiratedAt: abonement.expiratedAt,
      reservations: abonement.reservations?.map((id) => id.toString()) || [],
      paymentMethod: abonement.paymentMethod,
      extended: abonement.extended,
      createdAt: docWithTimestamps.createdAt || new Date(),
      updatedAt: docWithTimestamps.updatedAt || new Date(),
    };
  };
}
