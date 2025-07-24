import { IsOptional, IsUUID } from "class-validator";

export class RbacDto {
  @IsUUID()
  @IsOptional()
  id: string
}