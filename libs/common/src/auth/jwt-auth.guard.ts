import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';

import { catchError, map, tap } from 'rxjs/operators';
import { AUTH_SERVICE } from '../constant';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt =
      context.switchToHttp().getRequest().cookies?.Authentication ||
      context.switchToHttp().getRequest()?.Authentication ||
      context.switchToHttp().getRequest().headers?.authorization;

    if (!jwt) {
      return false;
    }

    return this.authClient
      .send('authenticate', { Authentication: jwt })
      .pipe(
        tap((res) => {
          console.log('[JwtAuthGuard] Auth Service Response:', res);
        }),
        map((res) => {
          if (!res || res?.statusCode === 403) return false;
          context.switchToHttp().getRequest<Request>().user = res;
          return true;
        }),
        catchError((err) => {
          console.error('[JwtAuthGuard] Error:', err);
          return of(false);
        }),
      );

  }
}