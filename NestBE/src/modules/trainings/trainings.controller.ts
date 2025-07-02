import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TrainingsService } from './trainings.service';
import {
  CreateTrainingDto,
  UpdateTrainingDto,
  TrainingQueryDto,
} from './dto/training.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UserRole } from '../../common/enums';

type UserPayload = {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
};

@ApiTags('trainings')
@Controller('trainings')
export class TrainingsController {
  constructor(private readonly trainingsService: TrainingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TRAINER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new training (Admin/Trainer only)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Training has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Trainer is not available at the selected time slot.',
  })
  async createTraining(@Body() createTrainingDto: CreateTrainingDto) {
    return this.trainingsService.createTraining(createTrainingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all trainings with filtering and pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of trainings with pagination info.',
  })
  async findAllTrainings(@Query() query: TrainingQueryDto) {
    return this.trainingsService.findAllTrainings(query);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming trainings' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of trainings to return',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of upcoming trainings.',
  })
  async getUpcomingTrainings(@Query('limit') limit?: number) {
    return this.trainingsService.getUpcomingTrainings(limit);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TRAINER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get training statistics' })
  @ApiQuery({
    name: 'trainerId',
    required: false,
    description: 'Filter by trainer ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Training statistics.',
  })
  async getTrainingStats(@Query('trainerId') trainerId?: string) {
    return this.trainingsService.getTrainingStats(trainerId);
  }

  @Get('trainer/my-trainings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TRAINER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current trainer trainings' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trainer trainings list.',
  })
  async findMyTrainings(
    @GetUser() user: UserPayload,
    @Query() query: TrainingQueryDto,
  ) {
    return this.trainingsService.findTrainerTrainings(user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get training by ID' })
  @ApiParam({ name: 'id', description: 'Training ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Training details.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Training not found.',
  })
  async findTrainingById(@Param('id') id: string) {
    return this.trainingsService.findTrainingById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TRAINER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update training (Admin/Trainer only)' })
  @ApiParam({ name: 'id', description: 'Training ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Training has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Trainer is not available at the selected time slot.',
  })
  async updateTraining(
    @Param('id') id: string,
    @Body() updateTrainingDto: UpdateTrainingDto,
  ) {
    return this.trainingsService.updateTraining(id, updateTrainingDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TRAINER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate training (Admin/Trainer only)' })
  @ApiParam({ name: 'id', description: 'Training ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Training has been deactivated.',
  })
  async removeTraining(@Param('id') id: string) {
    return this.trainingsService.removeTraining(id);
  }

  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TRAINER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark training as completed (Admin/Trainer only)' })
  @ApiParam({ name: 'id', description: 'Training ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Training has been marked as completed.',
  })
  async completeTraining(@Param('id') id: string) {
    return this.trainingsService.completeTraining(id);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TRAINER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel training (Admin/Trainer only)' })
  @ApiParam({ name: 'id', description: 'Training ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Training has been cancelled.',
  })
  async cancelTraining(@Param('id') id: string) {
    return this.trainingsService.cancelTraining(id);
  }

  @Get('trainer/:trainerId/availability')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TRAINER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check trainer availability (Admin/Trainer only)' })
  @ApiParam({ name: 'trainerId', description: 'Trainer ID' })
  @ApiQuery({ name: 'startTime', description: 'Start time' })
  @ApiQuery({ name: 'endTime', description: 'End time' })
  @ApiQuery({
    name: 'excludeTrainingId',
    required: false,
    description: 'Training ID to exclude',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trainer availability status.',
  })
  async checkTrainerAvailability(
    @Param('trainerId') trainerId: string,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
    @Query('excludeTrainingId') excludeTrainingId?: string,
  ) {
    const isAvailable = await this.trainingsService.checkTrainerAvailability(
      trainerId,
      new Date(startTime),
      new Date(endTime),
      excludeTrainingId,
    );
    return { available: !isAvailable };
  }
}
