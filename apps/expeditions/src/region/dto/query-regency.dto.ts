import { IsInt, IsOptional } from "class-validator";
import { QueryProvinceDto } from "./query-province.dto";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class QueryRegencyDto extends QueryProvinceDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @ApiPropertyOptional({
      description: 'Province ID filter',
      example: null,
    })
    provinceId?: number;
}