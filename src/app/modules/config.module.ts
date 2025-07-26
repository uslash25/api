import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validationSchema } from '@/common/validation/env';

@Module({ imports: [
  NestConfigModule.forRoot({
    isGlobal:         true,
    envFilePath:      '.env',
    validationSchema: validationSchema,
  }),
] })
export class ConfigModule {
}
