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
import { CreateMcpRequestDto } from './dto/create-mcp-request.dto';
import { SendMCPChatDto } from './dto/send-mcp-chat.dto';
import { McpService } from './mcp.service';

@ApiTags('MCP')
@Controller('mcp')
export class McpController {
  constructor(private readonly mcpService: McpService) {
  }

  @Get('all')
  @Authenticated()
  @ApiOperation({ summary: 'Get all MCPs' })
  async getAllMcps() {
    return this.mcpService.getAllMcps();
  }

  @Get('/:mcpId')
  @Authenticated()
  @ApiOperation({ summary: 'Get MCP by ID' })
  async getMcpById(@Param('mcpId') mcpId: string) {
    return this.mcpService.getMcpById(mcpId);
  }

  @Get('/:mcpId/chat')
  @Authenticated()
  @ApiOperation({ summary: 'Get MCP chats' })
  async getMcpChats(@Param('mcpId') mcpId: string) {
    return this.mcpService.getChats(mcpId);
  }

  @Post()
  @Authenticated()
  async createMcp(@Body() dto: CreateMcpRequestDto, @CurrentUser() user: User) {
    return this.mcpService.createMcp(dto, user.id);
  }

  @Post('/:mcpId/chat')
  @Authenticated()
  async sendMessage(@Param('mcpId') mcpId: string, @Body() dto: SendMCPChatDto) {
    return this.mcpService.sendUserMessage(mcpId, dto.message);
  }
}
