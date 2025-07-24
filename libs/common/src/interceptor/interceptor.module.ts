import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { ResponseInterceptor } from './response.interceptor';

@Module({
  imports: [DatabaseModule],
  exports: [ResponseInterceptor,],
  providers: [ResponseInterceptor,]
})
export class InterceptorModule {}
