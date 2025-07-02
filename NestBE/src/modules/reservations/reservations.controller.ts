import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
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
import { ReservationsService } from './reservations.service';
import {
  CreateReservationDto,
  UpdateReservationDto,
  ReservationQueryDto,
  FeedbackDto,
} from './dto/reservation.dto';
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

@ApiTags('reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new reservation' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Reservation has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Training is at maximum capacity or user already has reservation.',
  })
  async createReservation(
    @GetUser() user: UserPayload,
    @Body() createReservationDto: CreateReservationDto,
  ) {
    return this.reservationsService.create({
      ...createReservationDto,
      user: user.id,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TRAINER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all reservations (Admin/Trainer only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of reservations with pagination info.',
  })
  async findAllReservations(@Query() query: ReservationQueryDto) {
    return this.reservationsService.findAllReservations(query);
  }

  @Get('my-reservations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user reservations' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User reservations list.',
  })
  async findMyReservations(
    @GetUser() user: UserPayload,
    @Query() query: ReservationQueryDto,
  ) {
    return this.reservationsService.findUserReservations(user.id, query);
  }

  @Get('upcoming')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user upcoming reservations' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of reservations to return',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User upcoming reservations.',
  })
  async getUpcomingReservations(
    @GetUser() user: UserPayload,
    @Query('limit') limit?: number,
  ) {
    return this.reservationsService.getUpcomingReservations(user.id, limit);
  }

  @Get('trainer/my-reservations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TRAINER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current trainer reservations' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trainer reservations list.',
  })
  async findMyTrainerReservations(
    @GetUser() user: UserPayload,
    @Query() query: ReservationQueryDto,
  ) {
    return this.reservationsService.findTrainerReservations(user.id, query);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TRAINER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get reservation statistics' })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter by user ID',
  })
  @ApiQuery({
    name: 'trainerId',
    required: false,
    description: 'Filter by trainer ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reservation statistics.',
  })
  async getReservationStats(
    @Query('userId') userId?: string,
    @Query('trainerId') trainerId?: string,
  ) {
    return this.reservationsService.getReservationStats(userId, trainerId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get reservation by ID' })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reservation details.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Reservation not found.',
  })
  async findReservationById(@Param('id') id: string) {
    return this.reservationsService.findReservationById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TRAINER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update reservation (Admin/Trainer only)' })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reservation has been successfully updated.',
  })
  async updateReservation(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.updateReservation(id, updateReservationDto);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel reservation' })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  @ApiQuery({
    name: 'reason',
    required: false,
    description: 'Cancellation reason',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reservation has been cancelled.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Reservation cannot be cancelled.',
  })
  async cancelReservation(@Param('id') id: string) {
    return this.reservationsService.cancelReservation(id);
  }

  @Patch(':id/attend')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TRAINER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Mark reservation as attended (Admin/Trainer only)',
  })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reservation has been marked as attended.',
  })
  async markAsAttended(@Param('id') id: string) {
    return this.reservationsService.markAsAttended(id);
  }

  @Patch(':id/feedback')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add feedback to completed reservation' })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Feedback has been added.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Feedback can only be added to completed reservations.',
  })
  async addFeedback(@Param('id') id: string, @Body() feedbackDto: FeedbackDto) {
    return this.reservationsService.addFeedback(id, feedbackDto);
  }
}
