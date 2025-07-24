import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateShipmentDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: "1234567890" })
  shipping_number?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: "1234567890" })
  internal_receipt?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ example: 1 })
  qty?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;
  @ApiProperty({ example: "1234567890" })
  @IsString()
  sender_name: string;
  @ApiProperty({ example: "1234567890" })
  @IsString()
  receiver_name: string;
  @ApiProperty({ example: "1234567890" })
  @IsString()
  sender_phone: string;
  @ApiProperty({ example: "1234567890" })
  @IsString()
  receiver_phone: string;

  @ApiProperty({ example: "2ae4e34d-ddb4-4200-a479-b7c350d28f50" })
  @IsUUID()
  status_shipment_id: string;
  @ApiProperty({ example: "1" })
  @IsNumber()
  origin_regency_id: number;
  @IsNumber()
  @ApiProperty({ example: "1" })
  destination_regency_id: number;
  @IsUUID()
  @ApiProperty({ example: "2ae4e34d-ddb4-4200-a479-b7c350d28f50" })
  driver_user_id: string;
  @IsUUID()
  @ApiProperty({ example: "2ae4e34d-ddb4-4200-a479-b7c350d28f50" })
  cs_user_id: string;
  @IsUUID()
  @ApiProperty({ example: "2ae4e34d-ddb4-4200-a479-b7c350d28f50" })
  primary_service_id: string;
  @IsUUID()
  @ApiProperty({ example: "2ae4e34d-ddb4-4200-a479-b7c350d28f50" })
  payment_service_id: string;
  @IsUUID()
  @ApiProperty({ example: "2ae4e34d-ddb4-4200-a479-b7c350d28f50" })
  shipment_service_id: string;
  @IsUUID()
  @ApiProperty({ example: "2ae4e34d-ddb4-4200-a479-b7c350d28f50" })
  package_service_id: string;
  @IsOptional()
  @IsString()
  note?: string;
}
