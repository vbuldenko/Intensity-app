import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTokenDto {
  @ApiProperty({ example: '64f8c5a4e12b3c4d56789012' })
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  refreshToken: string;
}

export class UpdateTokenDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  refreshToken?: string;
}

export class TokenResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
