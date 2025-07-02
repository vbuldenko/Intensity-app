import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsBoolean,
  IsArray,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTrainingDto {
  @ApiProperty({ example: 'CrossFit' })
  @IsString()
  type: string;

  @ApiProperty({
    enum: ['group', 'personal', 'split'],
    example: 'group',
  })
  @IsEnum(['group', 'personal', 'split'])
  format: 'group' | 'personal' | 'split';

  @ApiProperty({ example: '64f8c5a4e12b3c4d56789012' })
  @IsString()
  instructor: string;

  @ApiProperty({ example: 15 })
  @IsNumber()
  @Min(1)
  capacity: number;

  @ApiProperty()
  @IsDateString()
  date: Date;

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

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  reservations?: string[];

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isCancelled?: boolean;
}

export class UpdateTrainingDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({
    enum: ['group', 'personal', 'split'],
  })
  @IsEnum(['group', 'personal', 'split'])
  @IsOptional()
  format?: 'group' | 'personal' | 'split';

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  instructor?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  date?: Date;

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

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  reservations?: string[];

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isCancelled?: boolean;
}

export class TrainingResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  format: 'group' | 'personal' | 'split';

  @ApiProperty()
  instructor: string;

  @ApiProperty()
  capacity: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  day: string;

  @ApiProperty()
  time: string;

  @ApiPropertyOptional()
  reservations?: string[];

  @ApiPropertyOptional()
  isCancelled?: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
