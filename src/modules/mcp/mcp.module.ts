import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LogModule } from '@/common/modules/log';
import { McpController } from './mcp.controller';
import { McpRepository } from './mcp.repository';
import { McpService } from './mcp.service';

@Module({
  imports:     [HttpModule, LogModule],
  controllers: [McpController],
  providers:   [McpService, McpRepository],
  exports:     [McpService],
})
export class McpModule {
}
