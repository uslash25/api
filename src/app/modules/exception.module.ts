import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from '@/common/filters/global-exception.filter';
import { PrismaExceptionFilter } from '@/common/filters/global-prisma-exception.filter';
import { LogModule } from '@/common/modules/log';

@Module({
  imports:   [LogModule],
  providers: [
    {
      provide:  APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide:  APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
  ],
})
export class ExceptionModule {
}
