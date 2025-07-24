import { BaseQueryDto } from "@app/common";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { serviceEnum } from '@prisma/client';
import { IsEnum, IsOptional } from "class-validator";

export class ServiceQueryDto extends BaseQueryDto {
  @ApiPropertyOptional({
    description: 'Service category filter',
    enum: serviceEnum,
    example: serviceEnum.package
  })
  @IsOptional()
  @IsEnum(serviceEnum, { message: 'Invalid service category' })
  category?: serviceEnum;
}