import { Module, Query } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
@Module({
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
