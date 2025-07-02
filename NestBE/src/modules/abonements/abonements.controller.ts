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
import { AbonementsService } from './abonements.service';
import {
  CreateAbonementDto,
  UpdateAbonementDto,
  PurchaseAbonementDto,
  UpdateUserAbonementDto,
} from './dto/abonement.dto';
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

@ApiTags('abonements')
@Controller('abonements')
export class AbonementsController {
  constructor(private readonly abonementsService: AbonementsService) {}

  // Abonement management (Admin only)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new abonement (Admin only)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Abonement has been successfully created.',
  })
  async createAbonement(@Body() createAbonementDto: CreateAbonementDto) {
    return this.abonementsService.createAbonement(createAbonementDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active abonements' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all active abonements.',
  })
  async findAllAbonements() {
    return this.abonementsService.findAllAbonements();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get abonement statistics (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Abonement statistics.',
  })
  async getAbonementStats() {
    return this.abonementsService.getAbonementStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get abonement by ID' })
  @ApiParam({ name: 'id', description: 'Abonement ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Abonement details.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Abonement not found.',
  })
  async findAbonementById(@Param('id') id: string) {
    return this.abonementsService.findAbonementById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update abonement (Admin only)' })
  @ApiParam({ name: 'id', description: 'Abonement ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Abonement has been successfully updated.',
  })
  async updateAbonement(
    @Param('id') id: string,
    @Body() updateAbonementDto: UpdateAbonementDto,
  ) {
    return this.abonementsService.updateAbonement(id, updateAbonementDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate abonement (Admin only)' })
  @ApiParam({ name: 'id', description: 'Abonement ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Abonement has been deactivated.',
  })
  async removeAbonement(@Param('id') id: string) {
    return this.abonementsService.removeAbonement(id);
  }

  // User abonement management
  @Post('purchase')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Purchase an abonement' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Abonement has been successfully purchased.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User already has an active abonement.',
  })
  async purchaseAbonement(
    @GetUser() user: UserPayload,
    @Body() purchaseDto: PurchaseAbonementDto,
  ) {
    return this.abonementsService.purchaseAbonement(user.id, purchaseDto);
  }

  @Get('user/my-abonements')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user abonements' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User abonements list.',
  })
  async findMyAbonements(@GetUser() user: UserPayload) {
    return this.abonementsService.findUserAbonements(user.id);
  }

  @Get('user/active')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user active abonement' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User active abonement.',
  })
  async findMyActiveAbonement(@GetUser() user: UserPayload) {
    return this.abonementsService.findActiveUserAbonement(user.id);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TRAINER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user abonements (Admin/Trainer only)' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User abonements list.',
  })
  async findUserAbonements(@Param('userId') userId: string) {
    return this.abonementsService.findUserAbonements(userId);
  }

  @Patch('user-abonement/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user abonement (Admin only)' })
  @ApiParam({ name: 'id', description: 'User abonement ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User abonement has been updated.',
  })
  async updateUserAbonement(
    @Param('id') id: string,
    @Body() updateDto: UpdateUserAbonementDto,
  ) {
    return this.abonementsService.updateUserAbonement(id, updateDto);
  }

  @Patch('user-abonement/:id/suspend')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Suspend user abonement (Admin only)' })
  @ApiParam({ name: 'id', description: 'User abonement ID' })
  @ApiQuery({ name: 'suspendedUntil', description: 'Suspended until date' })
  @ApiQuery({ name: 'reason', description: 'Suspension reason' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User abonement has been suspended.',
  })
  async suspendAbonement(
    @Param('id') id: string,
    @Query('suspendedUntil') suspendedUntil: string,
    @Query('reason') reason: string,
  ) {
    return this.abonementsService.suspendAbonement(id, reason);
  }

  @Patch('user-abonement/:id/reactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reactivate user abonement (Admin only)' })
  @ApiParam({ name: 'id', description: 'User abonement ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User abonement has been reactivated.',
  })
  async reactivateAbonement(@Param('id') id: string) {
    return this.abonementsService.reactivateAbonement(id);
  }
}
