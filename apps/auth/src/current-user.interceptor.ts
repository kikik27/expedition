// import { DatabaseService } from '@app/common';
// import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
// import { Observable } from 'rxjs';

// @Injectable()
// export class CurrentUserInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const req = context.switchToHttp().getRequest();
//     const user = req.user; // Asumsikan sudah ada user dari auth guard

//     if (user) {
//       DatabaseService.requestUserId = user.id;
//     }

//     return next.handle();
//   }
// }

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from './users/dto/user.dto';

const getCurrentUserByContex = (ctx: ExecutionContext): UserDto => {
  return ctx.switchToHttp().getRequest().user;
};
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => getCurrentUserByContex(ctx),
);