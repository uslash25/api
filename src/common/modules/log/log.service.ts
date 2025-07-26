import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class LogService implements LoggerService {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER)
  private readonly logger: LoggerService) {
  }

  log(message: string, context?: string) {
    this.logger.log(message, context);
  }

  error(message: string, context?: string) {
    this.logger.error(message, context);
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, context);
  }
}
