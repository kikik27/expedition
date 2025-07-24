import {
  UseInterceptors,
} from '@nestjs/common';
import { ResponseInterceptor } from './response.interceptor';

export function Serialize(dto: any) {
  return UseInterceptors(new ResponseInterceptor(dto));
}
