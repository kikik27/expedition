import { BaseQueryDto } from "@app/common";
import { IsOptional, IsString, IsUUID } from "class-validator";

export class RbacQueryDto extends BaseQueryDto {
  @IsOptional()
  @IsUUID()
  roleId?: string; 

  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsString()
  subject?: string;
}