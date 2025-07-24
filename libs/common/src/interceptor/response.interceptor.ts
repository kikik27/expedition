// response.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Type,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

export interface Response<T> {
  statusCode?: number;
  message?: string;
  access_token?: string;
  data?: T;
  meta_data?: {
    total: number;
    page: number;
    limit: number;
    hasPrevPage?: boolean;
    hasNextPage?: boolean;
  } | null;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  constructor(private dto?: Type<any>) { } // dto opsional

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const statusCode = context.switchToHttp().getResponse().statusCode;

    return next.handle().pipe(
      map((data) => {
        let filteredData: any = data?.data || data;

        // Apply DTO if provided
        if (this.dto && filteredData) {
          filteredData = Array.isArray(filteredData)
            ? plainToInstance(this.dto, filteredData, { excludeExtraneousValues: true })
            : plainToInstance(this.dto, filteredData, { excludeExtraneousValues: true });
        }

        // Format response
        const baseResponse: Response<T> = {
          statusCode,
          message: data?.message || 'Success',
        };

        if (data?.access_token) {
          return {
            ...baseResponse,
            access_token: data.access_token,
          };
        }

        if (data?.meta_data) {
          return {
            ...baseResponse,
            data: filteredData,
            meta_data: data.meta_data,
          };
        }

        return {
          ...baseResponse,
          data: filteredData,
        };
      }),
    );
  }
}
