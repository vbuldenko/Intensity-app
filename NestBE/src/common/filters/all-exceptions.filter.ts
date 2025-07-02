import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

type ErrorResponse = {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | string[];
  error?: string;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch = (exception: unknown, host: ArgumentsHost): void => {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.getHttpStatus(exception);
    const message = this.getErrorMessage(exception);
    const error = this.getErrorName(exception);

    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      ...(error && { error }),
    };

    this.logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify(errorResponse),
    );

    response.status(status).json(errorResponse);
  };

  private getHttpStatus = (exception: unknown): number => {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    // Handle specific error types
    if (exception instanceof Error) {
      if (exception.name === 'ValidationError') {
        return HttpStatus.BAD_REQUEST;
      }
      if (exception.name === 'CastError') {
        return HttpStatus.BAD_REQUEST;
      }
      if (exception.name === 'MongoError' && 'code' in exception) {
        type MongoError = Error & { code?: number };
        const mongoError = exception as MongoError;
        if (mongoError.code === 11000) {
          return HttpStatus.CONFLICT;
        }
      }
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  };

  private getErrorMessage = (exception: unknown): string | string[] => {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'string') {
        return response;
      }
      if (
        typeof response === 'object' &&
        response !== null &&
        'message' in response
      ) {
        const msg = (response as { message?: unknown }).message;
        if (typeof msg === 'string' || Array.isArray(msg)) {
          return msg;
        }
      }
    }

    if (exception instanceof Error) {
      if (exception.name === 'ValidationError') {
        return 'Validation failed';
      }
      if (exception.name === 'CastError') {
        return 'Invalid data format';
      }
      if (exception.name === 'MongoError' && 'code' in exception) {
        type MongoError = Error & { code?: number };
        const mongoError = exception as MongoError;
        if (mongoError.code === 11000) {
          return 'Duplicate entry found';
        }
      }
      return exception.message;
    }

    return 'Internal server error';
  };

  private getErrorName = (exception: unknown): string | undefined => {
    if (exception instanceof HttpException) {
      return exception.constructor.name;
    }
    if (exception instanceof Error) {
      return exception.name;
    }
    return undefined;
  };
}
