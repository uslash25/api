import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { McpController } from './mcp.controller';
import { McpRepository } from './mcp.repository';
import { McpService } from './mcp.service';

@Module({
  imports:     [HttpModule],
  controllers: [McpController],
  providers:   [McpService, McpRepository],
  exports:     [McpService],
})
export class McpModule {
}
