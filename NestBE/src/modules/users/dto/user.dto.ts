import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../../common/enums';

class SettingsDto {
  @ApiPropertyOptional({ default: 16 })
  @IsNumber()
  @IsOptional()
  fontSize?: number;
}

export class CreateUserDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  activationToken?: string | null;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => SettingsDto)
  @IsOptional()
  settings?: SettingsDto;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  abonements?: string[];

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  trainings?: string[];

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attendedTrainings?: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  profileImage?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  googleId?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  emailVerified?: boolean;
}

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  activationToken?: string | null;

  @ApiPropertyOptional({ example: 'John' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ enum: UserRole })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => SettingsDto)
  @IsOptional()
  settings?: SettingsDto;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  abonements?: string[];

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  trainings?: string[];

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attendedTrainings?: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  profileImage?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  googleId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  emailVerified?: boolean;
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiPropertyOptional()
  settings?: SettingsDto;

  @ApiPropertyOptional()
  abonements?: string[];

  @ApiPropertyOptional()
  trainings?: string[];

  @ApiPropertyOptional()
  attendedTrainings?: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
