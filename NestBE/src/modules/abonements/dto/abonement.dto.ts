import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAbonementDto {
  @ApiProperty({ example: '64f8c5a4e12b3c4d56789012' })
  @IsString()
  user: string;

  @ApiProperty({
    enum: ['active', 'ended', 'expired', 'inactive'],
    example: 'active',
  })
  @IsEnum(['active', 'ended', 'expired', 'inactive'])
  status: 'active' | 'ended' | 'expired' | 'inactive';

  @ApiProperty({
    enum: ['group', 'personal', 'split'],
    example: 'group',
  })
  @IsEnum(['group', 'personal', 'split'])
  type: 'group' | 'personal' | 'split';

  @ApiProperty({ example: 12 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ example: 299.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 12 })
  @IsNumber()
  @Min(0)
  left: number;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  activatedAt?: Date;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  expiratedAt?: Date;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  reservations?: string[];

  @ApiPropertyOptional({
    enum: ['card', 'cash'],
    default: 'card',
  })
  @IsEnum(['card', 'cash'])
  @IsOptional()
  paymentMethod?: 'card' | 'cash';

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  extended?: boolean;
}

export class UpdateAbonementDto {
  @ApiPropertyOptional({
    enum: ['active', 'ended', 'expired', 'inactive'],
  })
  @IsEnum(['active', 'ended', 'expired', 'inactive'])
  @IsOptional()
  status?: 'active' | 'ended' | 'expired' | 'inactive';

  @ApiPropertyOptional({
    enum: ['group', 'personal', 'split'],
  })
  @IsEnum(['group', 'personal', 'split'])
  @IsOptional()
  type?: 'group' | 'personal' | 'split';

  @ApiPropertyOptional()
  @IsNumber()
  @Min(1)
  @IsOptional()
  amount?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  left?: number;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  activatedAt?: Date;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  expiratedAt?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  reservations?: string[];

  @ApiPropertyOptional({
    enum: ['card', 'cash'],
  })
  @IsEnum(['card', 'cash'])
  @IsOptional()
  paymentMethod?: 'card' | 'cash';

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  extended?: boolean;

  @ApiPropertyOptional({ example: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class AbonementResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user: string;

  @ApiProperty()
  status: 'active' | 'ended' | 'expired' | 'inactive';

  @ApiProperty()
  type: 'group' | 'personal' | 'split';

  @ApiProperty()
  amount: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  left: number;

  @ApiPropertyOptional()
  activatedAt?: Date;

  @ApiPropertyOptional()
  expiratedAt?: Date;

  @ApiPropertyOptional()
  reservations?: string[];

  @ApiProperty()
  paymentMethod: 'card' | 'cash';

  @ApiProperty()
  extended: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PurchaseAbonementDto {
  @ApiProperty({ example: '64f8c5a4e12b3c4d56789012' })
  @IsString()
  abonementId: string;

  @ApiProperty({
    enum: ['card', 'cash'],
    example: 'card',
  })
  @IsEnum(['card', 'cash'])
  paymentMethod: 'card' | 'cash';

  @ApiPropertyOptional({ example: 'Purchased with discount' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateUserAbonementDto {
  @ApiPropertyOptional({
    enum: ['active', 'ended', 'expired', 'inactive'],
    example: 'active',
  })
  @IsEnum(['active', 'ended', 'expired', 'inactive'])
  @IsOptional()
  status?: 'active' | 'ended' | 'expired' | 'inactive';

  @ApiPropertyOptional({ example: 10 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  trainingsLeft?: number;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  expiratedAt?: string;

  @ApiPropertyOptional({ example: 'Updated by admin' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  extended?: boolean;
}
