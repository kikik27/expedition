import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";
import { serviceEnum } from '@prisma/client';

export class CreateServiceDto {
  @ApiProperty({ example: "Service Name" })
  @IsString()
  name: string;
  
  @ApiProperty({ example: "Service Category" })
  @IsEnum(serviceEnum, {'message': 'Category not valid'})
  category: serviceEnum
}
