import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ScheduleService } from './schedule.service';
import {
  CreateScheduleDto,
  UpdateScheduleDto,
  ScheduleResponseDto,
} from './dto/schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@ApiTags('schedule')
@Controller('schedules')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TRAINER)
  @ApiOperation({ summary: 'Create a new schedule entry' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Schedule entry created successfully',
    type: ScheduleResponseDto,
  })
  async create(
    @Body(ValidationPipe) scheduleData: CreateScheduleDto,
  ): Promise<ScheduleResponseDto> {
    return this.scheduleService.create(scheduleData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all schedule entries' })
  @ApiQuery({
    name: 'day',
    required: false,
    description: 'Filter by specific day',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Schedule entries retrieved successfully',
    type: [ScheduleResponseDto],
  })
  async findAll(@Query('day') day?: string): Promise<ScheduleResponseDto[]> {
    if (day) {
      return this.scheduleService.findByDay(day);
    }
    return this.scheduleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get schedule entry by ID' })
  @ApiParam({ name: 'id', description: 'Schedule ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Schedule entry retrieved successfully',
    type: ScheduleResponseDto,
  })
  async findById(@Param('id') id: string): Promise<ScheduleResponseDto> {
    return this.scheduleService.findById(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TRAINER)
  @ApiOperation({ summary: 'Update schedule entry' })
  @ApiParam({ name: 'id', description: 'Schedule ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Schedule entry updated successfully',
    type: ScheduleResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) scheduleData: UpdateScheduleDto,
  ): Promise<ScheduleResponseDto> {
    return this.scheduleService.update(id, scheduleData);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete schedule entry' })
  @ApiParam({ name: 'id', description: 'Schedule ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Schedule entry deleted successfully',
    type: ScheduleResponseDto,
  })
  async delete(@Param('id') id: string): Promise<ScheduleResponseDto> {
    return this.scheduleService.delete(id);
  }

  @Get('instructor/:instructorId')
  @ApiOperation({ summary: 'Get schedule entries by instructor' })
  @ApiParam({ name: 'instructorId', description: 'Instructor ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Schedule entries retrieved successfully',
    type: [ScheduleResponseDto],
  })
  async findByInstructor(
    @Param('instructorId') instructorId: string,
  ): Promise<ScheduleResponseDto[]> {
    return this.scheduleService.findByInstructor(instructorId);
  }
}
