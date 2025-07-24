import { Module } from '@nestjs/common';
import { StatusShipmentService } from './status-shipment.service';
import { StatusShipmentController } from './status-shipment.controller';

@Module({
  controllers: [StatusShipmentController],
  providers: [StatusShipmentService],
})
export class StatusShipmentModule {}
