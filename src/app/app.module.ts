import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LogModule } from '@/common/modules/log';
import { ExceptionModule } from './modules/exception.module';

@Module({ imports: [
  ConfigModule,
  LogModule,
  ExceptionModule,
] })
export class AppModule {
}
