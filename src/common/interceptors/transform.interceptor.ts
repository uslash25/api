import {
  type CallHandler,
  type ExecutionContext,
  HttpStatus,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import type { Response } from 'express';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponseDto } from '../dto/response.dto';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(map(data => {
      const apiResponse: BaseResponseDto = {
        status:    response.statusCode || HttpStatus.OK,
        instance:  request.url,
        detail:    null,
        data:      data,
        timestamp: new Date,
      };

      response.status(apiResponse.status).send(apiResponse);
    }));
  }
}
