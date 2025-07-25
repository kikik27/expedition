// src/common/interceptors/prisma-user.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DatabaseService } from '../database';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    console.log(`DATABASE USER ID LOG ${user.name}`)

    if (user && user.id) {
      DatabaseService.requestUserId = user.id;
    } else {
      DatabaseService.requestUserId = null;
    }

    return next.handle();
  }
}
