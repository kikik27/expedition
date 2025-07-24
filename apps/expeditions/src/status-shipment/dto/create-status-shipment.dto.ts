import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateStatusShipmentDto {
  @IsString()
  @ApiProperty({ example: "Status Shipment Name" })
  name: string;
}
