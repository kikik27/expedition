import { Controller, Get, UseGuards } from '@nestjs/common';
import { ExpeditionsService } from './expeditions.service';
import { JwtAuthGuard } from '@app/common';

@Controller()
export class ExpeditionsController {
  constructor(private readonly expeditionsService: ExpeditionsService) { }

  // @UseGuards(JwtAuthGuard)
  @Get()
  getHello(): string {
    return this.expeditionsService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get("/hi")
  getHi(){
    return this.expeditionsService.getHello()
  }
}
