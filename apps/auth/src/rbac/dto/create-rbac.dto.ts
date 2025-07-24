import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString, IsUUID } from "class-validator";

export class CreateRbacDto {
  @IsUUID()
  @ApiProperty({ example: "" })
  role_id: string;

  @IsString()
  @ApiProperty({ example: "read" })
  action: string;

  @IsString()
  @ApiProperty({ example: "User" })
  subject: string;

  @IsString()
  @ApiProperty({ example: '{"id": "{{ id }}"}' })
  conditions: string;

  @IsString()
  @ApiProperty({ example: "Permission reason" })
  reason: string;

  @IsBoolean()
  @ApiProperty({ example: false })
  inverted: boolean;

}
