import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LogModule } from '@/common/modules/log';
import { AuthModule } from '@/modules/auth/auth.module';
import { MCPModule } from '@/modules/mcp/mcp.module';
import { UserModule } from '@/modules/user/user.module';
import { ExceptionModule } from './modules/exception.module';

@Module({ imports: [
  ConfigModule,
  LogModule,
  ExceptionModule,
  AuthModule,
  UserModule,
  MCPModule,
] })
export class AppModule {
}
