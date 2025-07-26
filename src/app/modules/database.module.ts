import { Module } from '@nestjs/common';
import { RedisModule } from '@/common/modules/redis';

@Module({ imports: [RedisModule] })
export class DatabaseModule {
}
