import { Test, TestingModule } from '@nestjs/testing';
import { StatusShipmentController } from './status-shipment.controller';
import { StatusShipmentService } from './status-shipment.service';

describe('StatusShipmentController', () => {
  let controller: StatusShipmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusShipmentController],
      providers: [StatusShipmentService],
    }).compile();

    controller = module.get<StatusShipmentController>(StatusShipmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
