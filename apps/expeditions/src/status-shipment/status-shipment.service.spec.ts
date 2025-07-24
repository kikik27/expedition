import { Test, TestingModule } from '@nestjs/testing';
import { StatusShipmentService } from './status-shipment.service';

describe('StatusShipmentService', () => {
  let service: StatusShipmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatusShipmentService],
    }).compile();

    service = module.get<StatusShipmentService>(StatusShipmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
