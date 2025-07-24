import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ExceptionService implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionService.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let path = request.url;
    let method = request.method;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseError = exception.getResponse();
      message = typeof responseError === 'object' 
        ? (responseError as any).message || exception.message
        : exception.message;
    } else if (exception.code === 'P2002') {
      // Prisma unique constraint error
      status = HttpStatus.CONFLICT;
      message = 'Data already exists';
    } else if (exception.code === 'P2025') {
      // Prisma record not found
      status = HttpStatus.NOT_FOUND; 
      message = 'Data not found';
      
    } else if (exception.code === 'P2003') {
      // Prisma foreign key constraint violation
      status = HttpStatus.BAD_REQUEST;
      const constraint = exception.meta?.constraint;
      message = `Foreign key constraint failed on: ${constraint || 'unknown constraint'}`;
    } else {
      // Log unhandled exceptions
      this.logger.error('Unhandled exception:', exception);
      const fs = require('fs');
      const logMessage = `[${new Date().toISOString()}] Unhandled Exception:\nPath: ${method} ${path}\n${JSON.stringify(exception, null, 2)}\n\n`;
      fs.appendFileSync('error-logs.txt', logMessage);
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: path,
      method: method
    });
  }
}