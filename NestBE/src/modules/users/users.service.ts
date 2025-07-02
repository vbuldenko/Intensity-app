import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  private readonly saltRounds = 12;

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create = async (createUserDto: CreateUserDto): Promise<UserResponseDto> => {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      this.saltRounds,
    );

    const userData = {
      ...createUserDto,
      password: hashedPassword,
    };

    const createdUser = new this.userModel(userData);
    const savedUser = await createdUser.save();

    return this.mapToResponseDto(savedUser);
  };

  findAll = async (): Promise<UserResponseDto[]> => {
    const users = await this.userModel
      .find()
      .populate('abonements')
      .populate('trainings')
      .populate('attendedTrainings')
      .exec();

    return users.map((user) => this.mapToResponseDto(user));
  };

  findOne = async (id: string): Promise<UserResponseDto> => {
    this.validateObjectId(id);

    const user = await this.userModel
      .findById(id)
      .populate('abonements')
      .populate('trainings')
      .populate('attendedTrainings')
      .exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.mapToResponseDto(user);
  };

  findByEmail = async (email: string): Promise<UserDocument | null> => {
    return this.userModel.findOne({ email }).exec();
  };

  findByRole = async (role: string): Promise<UserResponseDto[]> => {
    const users = await this.userModel
      .find({ role })
      .populate('abonements')
      .populate('trainings')
      .populate('attendedTrainings')
      .exec();

    return users.map((user) => this.mapToResponseDto(user));
  };

  update = async (
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> => {
    this.validateObjectId(id);

    // Check if email is being changed and if it's already taken
    if (updateUserDto.email) {
      const existingUser = await this.userModel.findOne({
        email: updateUserDto.email,
        _id: { $ne: id },
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // Hash password if provided
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        this.saltRounds,
      );
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true, runValidators: true })
      .populate('abonements')
      .populate('trainings')
      .populate('attendedTrainings')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.mapToResponseDto(updatedUser);
  };

  remove = async (id: string): Promise<void> => {
    this.validateObjectId(id);

    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  };

  // Additional methods for auth service compatibility
  updateLastLogin = async (userId: string): Promise<void> => {
    await this.userModel.findByIdAndUpdate(userId, {
      lastLogin: new Date(),
    });
  };

  findByGoogleId = async (
    googleId: string,
  ): Promise<UserResponseDto | null> => {
    const user = await this.userModel.findOne({ googleId }).exec();
    return user ? this.mapToResponseDto(user) : null;
  };

  // Helper methods
  private validateObjectId = (id: string): void => {
    try {
      new Types.ObjectId(id);
    } catch {
      throw new BadRequestException('Invalid ObjectId format');
    }
  };

  private mapToResponseDto = (user: UserDocument): UserResponseDto => {
    const docWithTimestamps = user as UserDocument & {
      createdAt?: Date;
      updatedAt?: Date;
    };

    return {
      id: String(user._id),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      settings: user.settings,
      abonements: user.abonements?.map((id) => id.toString()) || [],
      trainings: user.trainings?.map((id) => id.toString()) || [],
      attendedTrainings:
        user.attendedTrainings?.map((id) => id.toString()) || [],
      createdAt: docWithTimestamps.createdAt || new Date(),
      updatedAt: docWithTimestamps.updatedAt || new Date(),
    };
  };
}
