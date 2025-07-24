import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from 'apps/auth/src/users/dto/user.dto';

const getCurrentUserByContex = (ctx: ExecutionContext): UserDto => {
  return ctx.switchToHttp().getRequest().user;
};
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => getCurrentUserByContex(ctx),
);