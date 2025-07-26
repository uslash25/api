import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { McpModule } from '../mcp/mcp.module';
import { McpGroupController } from './mcp-group.controller';
import { McpGroupRepository } from './mcp-group.repository';
import { McpGroupService } from './mcp-group.service';

@Module({
  imports:     [HttpModule, McpModule],
  controllers: [McpGroupController],
  providers:   [McpGroupService, McpGroupRepository],
  exports:     [],
})
export class McpGroupModule {
}
