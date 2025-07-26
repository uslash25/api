import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { McpChatRole } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { LogService } from '@/common/modules/log';
import { CreateMcpRequestDto } from './dto/create-mcp-request.dto';
import { McpRepository } from './mcp.repository';

@Injectable()
export class McpService {
  constructor(private readonly mcpRepository: McpRepository,
    private readonly httpService: HttpService,
    private readonly logger: LogService) {
  }

  async getChats(mcpId: string) {
    return this.mcpRepository.findChatsById(mcpId);
  }

  async getAllMcps() {
    const mcps = await this.mcpRepository.findAllMcps();
    const mcpGroups = await this.mcpRepository.findAllMcpGroups();

    return {
      mcps,
      mcpGroups,
    };
  }

  async getMcpById(mcpId: string) {
    return this.mcpRepository.findMcpById(mcpId);
  }

  async getMcpCode(mcpId: string) {
    const httpResponse = await firstValueFrom(this.httpService.get(`https://mcp.ruha.uno/api/code/${mcpId}`));

    const response: {
      data: string;
    } = httpResponse.data;

    return response;
  }

  async sendUserMessage(mcpId: string, message: string) {
    const allChats = await this.mcpRepository.findChatsById(mcpId);

    const chatHistory = [
      ...allChats.map(chat => ({
        role:    chat.role,
        content: chat.message,
      })), {
        role:    McpChatRole.USER,
        content: message,
      },
    ];

    this.logger.log(`MCP Chat history: ${JSON.stringify(chatHistory)}`);

    const httpResponse = await firstValueFrom(this.httpService.post('https://mcp.ruha.uno/api/ai/mcp', {
      id:           mcpId,
      chat_history: chatHistory,
      user_input:   message,
    }));

    this.logger.log(`MCP Create HTTP response: ${JSON.stringify(httpResponse.data)}`);

    const response: {
      description: string;
    } = httpResponse.data;

    await this.mcpRepository.sendMessage(mcpId, message, McpChatRole.USER);

    const assistantMessage = await this.mcpRepository.sendMessage(mcpId, response.description, McpChatRole.ASSISTANT);

    await this.mcpRepository.updateMcpDescription(mcpId, response.description);

    return assistantMessage;
  }

  async createMcp(dto: CreateMcpRequestDto, userId: string) {
    const response = {
      id:      dto.id,
      ownerId: userId,
    };

    const mcp = await this.mcpRepository.createMcp(response);

    await this.sendUserMessage(mcp.id, dto.prompt);

    return mcp;
  }

  async getMcpList() {
    return this.mcpRepository.findAllMcps();
  }
}
