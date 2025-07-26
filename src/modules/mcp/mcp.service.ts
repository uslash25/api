import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { McpChatRole } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { CreateMcpRequestDto } from './dto/create-mcp-request.dto';
import { McpRepository } from './mcp.repository';

@Injectable()
export class McpService {
  constructor(private readonly mcpRepository: McpRepository,
    private readonly httpService: HttpService) {
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

    const httpResponse = await firstValueFrom(this.httpService.post('https://mcp.ruha.uno/api/ai/mcp', {
      id:           mcpId,
      Chat_history: chatHistory,
      user_input:   message,
    }));

    const response: {
      description: string;
    } = httpResponse.data;

    const chat = await this.mcpRepository.sendMessage(mcpId, message, McpChatRole.USER);
    const assistantMessage = await this.mcpRepository.sendMessage(mcpId, response.description, McpChatRole.ASSISTANT);

    await this.mcpRepository.updateMcpDescription(mcpId, response.description);

    return {
      chat,
      assistantMessage,
    };
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
