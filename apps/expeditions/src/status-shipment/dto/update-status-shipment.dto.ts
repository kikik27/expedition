import { PartialType } from '@nestjs/swagger';
import { CreateStatusShipmentDto } from './create-status-shipment.dto';

export class UpdateStatusShipmentDto extends PartialType(CreateStatusShipmentDto) {}
