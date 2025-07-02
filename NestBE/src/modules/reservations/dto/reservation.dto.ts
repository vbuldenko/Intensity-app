import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({ example: '64f8c5a4e12b3c4d56789012' })
  @IsString()
  training: string;

  @ApiProperty({ example: '64f8c5a4e12b3c4d56789013' })
  @IsString()
  user: string;

  @ApiProperty({ example: '64f8c5a4e12b3c4d56789014' })
  @IsString()
  abonement: string;

  @ApiPropertyOptional({
    enum: ['active', 'cancelled'],
    default: 'active',
  })
  @IsEnum(['active', 'cancelled'])
  @IsOptional()
  status?: string;
}

export class UpdateReservationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  training?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  user?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  abonement?: string;

  @ApiPropertyOptional({
    enum: ['active', 'cancelled'],
  })
  @IsEnum(['active', 'cancelled'])
  @IsOptional()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  feedback?: {
    rating: number;
    comment?: string;
  };
}

export class ReservationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  training: string;

  @ApiProperty()
  user: string;

  @ApiProperty()
  abonement: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ReservationQueryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  trainerId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  date?: string;
}

export class FeedbackDto {
  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsString()
  rating: string;

  @ApiPropertyOptional({ example: 'Great training session!' })
  @IsString()
  @IsOptional()
  comment?: string;
}
