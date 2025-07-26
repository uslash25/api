import { Module } from '@nestjs/common';
import { LogModule } from '@/common/modules/log';
import { PrismaModule } from '@/common/modules/prisma';
import { AuthModule } from '../auth/auth.module';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    LogModule,
  ],
  controllers: [UserController],
  providers:   [UserService, UserRepository],
  exports:     [UserService],
})
export class UserModule {
}
