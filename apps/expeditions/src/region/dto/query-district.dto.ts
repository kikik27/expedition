import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { QueryRegencyDto } from './query-regency.dto';

export class DistrictQueryDto extends QueryRegencyDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @ApiPropertyOptional({
    description: 'Regency ID filter',
    example: null,
  })
  regencyId?: number;
}
