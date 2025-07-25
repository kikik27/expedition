import { BaseQueryDto } from "@app/common";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class QueryProvinceDto extends BaseQueryDto {
  @ApiPropertyOptional({
    description: 'Sort field',
    example: 'name'
  })
  @IsOptional()
  @IsString({ message: 'Sort field must be a string' })
  sortBy?: string = 'name';
}