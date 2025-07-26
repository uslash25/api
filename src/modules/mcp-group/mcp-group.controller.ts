import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Authenticated, CurrentUser } from '../auth/decorators';
import { CreateMcpGroupByChoiceRequestDto } from './dto/create-mcp-group-by-choice-request.dto';
import { CreateMcpGroupByNlRequestDto } from './dto/create-mcp-group-by-nl-request.dto';
import { SendMCPChatDto } from './dto/send-mcp-chat.dto';
import { McpGroupService } from './mcp-group.service';

@ApiTags('MCP Group')
@Controller('mcp-group')
export class McpGroupController {
  constructor(private readonly mcpGroupService: McpGroupService) {
  }

  @Get('/:mcpGroupId')
  @Authenticated()
  @ApiOperation({ summary: 'Get MCP Group by ID' })
  async getMcpGroupById(@Param('mcpGroupId') mcpGroupId: string) {
    return this.mcpGroupService.getMcpGroupById(mcpGroupId);
  }

  @Get('/:mcpGroupId/chat')
  @Authenticated()
  @ApiOperation({ summary: 'Get MCP Group chats' })
  async getMcpChats(@Param('mcpGroupId') mcpGroupId: string) {
    return this.mcpGroupService.getChats(mcpGroupId);
  }

  @Post('/:mcpGroupId/deploy')
  @Authenticated()
  @ApiOperation({ summary: 'Deploy MCP Group' })
  async deployMcpGroup(@Param('mcpGroupId') mcpGroupId: string) {
    return this.mcpGroupService.deployMcpGroup(mcpGroupId);
  }

  @Post('/choice')
  @Authenticated()
  async createMcpGroupByChoice(@Body() dto: CreateMcpGroupByChoiceRequestDto, @CurrentUser() user: User) {
    return this.mcpGroupService.createMcpGroupByChoice(dto, user.id);
  }

  @Post('/nl')
  @Authenticated()
  async createMcpGroupByNl(@Body() dto: CreateMcpGroupByNlRequestDto, @CurrentUser() user: User) {
    return this.mcpGroupService.createMcpGroupByNl(dto, user.id);
  }

  @Post('/:mcpGroupId/chat')
  @Authenticated()
  async sendMessage(@Param('mcpGroupId') mcpGroupId: string, @Body() dto: SendMCPChatDto) {
    return this.mcpGroupService.sendUserMessage(mcpGroupId, dto.message);
  }
}
