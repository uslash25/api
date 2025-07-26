import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { LogService } from '@/common/modules/log';
import { BaseResponseDto } from '../dto/response.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LogService) {
  }

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 이미 응답이 전송되었는지 확인
    if (response.headersSent) {
      return;
    }

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception.message || 'Internal Server Error';

    const apiResponse: BaseResponseDto = {
      status:    status,
      instance:  request.url,
      detail:    null,
      data:      null,
      timestamp: new Date,
    };

    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse() as {
        message: Array<string> | string;
      };

      const messages = typeof exceptionResponse.message === 'string'
        ? [exceptionResponse.message]
        : exceptionResponse.message;

      apiResponse.detail = messages.join(', ');
    } else {
      apiResponse.detail = message;
    }

    response.status(status).json(apiResponse);

    const isDevelopment = process.env.NODE_ENV === 'development';
    const is4xxError = status >= 400 && status < 500;
    const is5xxError = status >= 500;

    if (isDevelopment) {
      if ((is4xxError && status !== HttpStatus.NOT_FOUND) || is5xxError) {
        this.logDetailedError(exception, request);
      }
    } else {
      if (is5xxError) {
        this.logger.error(`${exception.name} - ${exception.message}`, 'GlobalExceptionFilter');
      }
    }
  }

  private logDetailedError(exception: Error, request: Request) {
    const timestamp = (new Date).toISOString();

    const errorDetails = {
      timestamp,
      exception: {
        name:    exception.name,
        message: exception.message,
        stack:   exception.stack?.split('\n').slice(0, 10)
          .join('\n'),
      },
      request: {
        method:        request.method,
        url:           request.url,
        authorization: request.headers.authorization || '',
        body:          request.body,
      },
    };

    this.logger.error(`🚨 Detailed Exception Log\n${JSON.stringify(errorDetails, null, 2)}`,
      'GlobalExceptionFilter');
  }
}
