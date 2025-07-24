import { Injectable } from '@nestjs/common';

@Injectable()
export class ExpeditionsService {
  getHello(): string {
    return 'Hello World!';
  }
}
