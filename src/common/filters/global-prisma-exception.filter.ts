import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { BaseResponseDto } from '../dto/response.dto';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);
  private readonly configService = new ConfigService;

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const isProduction = this.configService.get('NODE_ENV') === 'production';

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected database error occurred.';

    switch (exception.code) {
      case 'P2000':
        statusCode = HttpStatus.BAD_REQUEST;

        message = 'Input value is too long. Please use a shorter value.';

        break;

      case 'P2002':
        statusCode = HttpStatus.CONFLICT;

        message = `The value for '${exception.meta?.target?.[0] || 'field'}' already exists. Please use a different one.`;

        break;

      case 'P2003':
        statusCode = HttpStatus.BAD_REQUEST;

        message = `Invalid reference: related record for '${exception.meta?.field_name || 'foreign key'}' does not exist.`;

        break;

      case 'P2010':
        statusCode = HttpStatus.BAD_REQUEST;

        message = 'Invalid query or parameters. Please contact support.';

        break;

      case 'P2014':
        statusCode = HttpStatus.BAD_REQUEST;

        message = 'Data integrity error. Please verify related records.';

        break;

      case 'P2023':
        statusCode = HttpStatus.BAD_REQUEST;

        message = 'Invalid data format. Please check your JSON data.';

        break;

      case 'P2025':
        statusCode = HttpStatus.NOT_FOUND;

        message = 'The requested record could not be found. It may have been deleted.';

        break;

      default:
        message = exception.message || 'An unexpected database error occurred.';

        break;
    }

    if (!isProduction) {
      this.logDetailedError(exception, ctx.getRequest<Request>());
    }

    const apiResponse: BaseResponseDto = {
      status:    statusCode,
      instance:  ctx.getRequest<Request>().url,
      detail:    message,
      data:      null,
      timestamp: new Date,
    };

    response.status(statusCode).send(apiResponse);
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
        authorization: request.headers.authorization,
        body:          request.body,
      },
    };

    this.logger.error(`
🚨 Prisma Exception Details
${'='.repeat(60)}
${JSON.stringify(errorDetails, null, 2)}
${'='.repeat(60)}
`);
  }
}
