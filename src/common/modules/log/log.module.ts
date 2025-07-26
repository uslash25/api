import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { LogService } from './log.service';

@Module({
  imports: [
    WinstonModule.forRoot({ transports: [
      new winston.transports.Console({ format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.colorize(),
        winston.format.printf(({
          timestamp,
          level,
          message,
          context,
        }) => {
          return `[${timestamp}] [${level}] ${context ? `[${context}]` : ''} ${message}`;
        })) }),
    ] }),
  ],
  providers: [LogService],
  exports:   [WinstonModule, LogService],
})
export class LogModule {
}

