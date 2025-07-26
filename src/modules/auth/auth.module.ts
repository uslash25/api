import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LogModule } from '@/common/modules/log';
import { PrismaModule } from '@/common/modules/prisma';
import { RedisModule } from '@/common/modules/redis';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './repositories/auth.repository';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    PrismaModule,
    RedisModule,
    LogModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({ secret: configService.get<string>('JWT_SECRET') }),
      inject:     [ConfigService],
    }),
  ],
  providers: [
    JwtStrategy, AuthService, AuthRepository,
  ],
  exports:     [AuthService],
  controllers: [AuthController],
})
export class AuthModule {
}
