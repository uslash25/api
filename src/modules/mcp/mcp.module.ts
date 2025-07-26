import { Module } from '@nestjs/common';
import { McpController } from './mcp.controller';
import { McpRepository } from './mcp.repository';
import { McpService } from './mcp.service';

@Module({
  imports:     [],
  controllers: [McpController],
  providers:   [McpService, McpRepository],
  exports:     [],
})
export class MCPModule {
}
