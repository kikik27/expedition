import { Test, TestingModule } from '@nestjs/testing';
import { ExpeditionsController } from './expeditions.controller';
import { ExpeditionsService } from './expeditions.service';

describe('ExpeditionsController', () => {
  let expeditionsController: ExpeditionsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ExpeditionsController],
      providers: [ExpeditionsService],
    }).compile();

    expeditionsController = app.get<ExpeditionsController>(ExpeditionsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(expeditionsController.getHello()).toBe('Hello World!');
    });
  });
});
