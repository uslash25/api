import { RedisModule as NestRedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({
  imports: [
    NestRedisModule.forRoot({ config: {
      url:                  process.env.REDIS_URL,
      maxRetriesPerRequest: 3,
      enableReadyCheck:     false,
      connectTimeout:       1000,
      lazyConnect:          true,
    } }),
  ],
  providers: [RedisService],
  exports:   [RedisService],
})
export class RedisModule {
}
