// src/common/dto/base-query.dto.ts
import { IsOptional, IsNumber, IsString, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BaseQueryDto {
  @ApiPropertyOptional({
    description: 'Page number',
    minimum: 1,
    default: 1,
    example: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
    default: 10,
    example: 10
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search term for filtering results',
    example: ''
  })
  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  @Transform(({ value }) => value?.trim())
  search?: string = '';

  @ApiPropertyOptional({
    description: 'Sort field',
    example: ''
  })
  @IsOptional()
  @IsString({ message: 'Sort field must be a string' })
  sortBy?: string = '';

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    example: 'desc'
  })
  @IsOptional()
  @IsString({ message: 'Sort order must be a string' })
  @Transform(({ value }) => value?.toLowerCase())
  sortOrder?: 'asc' | 'desc' = 'desc';
}