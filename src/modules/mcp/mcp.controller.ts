import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators';
import { CreateMcpRequestDto } from './dto/create-mcp-request.dto';
import { SendMCPChatDto } from './dto/send-mcp-chat.dto';
import { McpService } from './mcp.service';

@Controller('mcp')
export class McpController {
  constructor(private readonly mcpService: McpService) {
  }

  @Get('/:mcpId/chat')
  async getMcpChats(@Param('mcpId') mcpId: string) {
    return this.mcpService.getChats(mcpId);
  }

  @Post()
  async createMcp(@Body() dto: CreateMcpRequestDto, @CurrentUser() user: User) {
    return this.mcpService.createMcp(dto, user.id);
  }

  @Post('/:mcpId/chat')
  async sendMessage(@Param('mcpId') mcpId: string, @Body() dto: SendMCPChatDto) {
    return this.mcpService.sendUserMessage(mcpId, dto.message);
  }
}
