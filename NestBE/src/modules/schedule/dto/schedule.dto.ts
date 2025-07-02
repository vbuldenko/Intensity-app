import { IsString, IsOptional, IsEnum, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty({ example: 'CrossFit' })
  @IsString()
  type: string;

  @ApiProperty({ example: '64f8c5a4e12b3c4d56789012' })
  @IsString()
  instructor: string;

  @ApiProperty({ example: 15 })
  @IsNumber()
  @Min(1)
  maxCapacity: number;

  @ApiProperty({
    enum: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    example: 'Monday',
  })
  @IsEnum([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ])
  day: string;

  @ApiProperty({ example: '10:00' })
  @IsString()
  time: string;
}

export class UpdateScheduleDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  instructor?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(1)
  @IsOptional()
  maxCapacity?: number;

  @ApiPropertyOptional({
    enum: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
  })
  @IsEnum([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ])
  @IsOptional()
  day?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  time?: string;
}

export class ScheduleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  instructor: string;

  @ApiProperty()
  maxCapacity: number;

  @ApiProperty()
  day: string;

  @ApiProperty()
  time: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
