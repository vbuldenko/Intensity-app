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
  method: string;
  message: string;
  error?: string;
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch = (exception: unknown, host: ArgumentsHost): void => {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = isHttpException
      ? exception.getResponse()
      : 'Internal server error';

    const getErrorMessage = (msg: unknown): string => {
      if (typeof msg === 'string') {
        return msg;
      }
      if (typeof msg === 'object' && msg !== null && 'message' in msg) {
        return String((msg as Record<string, unknown>).message);
      }
      return 'An error occurred';
    };

    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: getErrorMessage(message),
      ...(status >= 500 && { error: 'Internal Server Error' }),
    };

    // Log the error
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : exception,
      );
    } else {
      this.logger.warn(
        `${request.method} ${request.url} - ${status} - ${errorResponse.message}`,
      );
    }

    response.status(status).json(errorResponse);
  };
}
