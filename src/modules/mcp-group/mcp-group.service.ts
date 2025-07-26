import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { McpChatRole } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { LogService } from '@/common/modules/log';
import { McpService } from '../mcp/mcp.service';
import { CreateMcpGroupByChoiceRequestDto } from './dto/create-mcp-group-by-choice-request.dto';
import { CreateMcpGroupByNlRequestDto } from './dto/create-mcp-group-by-nl-request.dto';
import { McpGroupRepository } from './mcp-group.repository';

@Injectable()
export class McpGroupService {
  constructor(private readonly mcpGroupRepository: McpGroupRepository,
    private readonly httpService: HttpService,
    private readonly mcpService: McpService,
    private readonly logger: LogService) {
  }

  async getChats(mcpId: string) {
    return this.mcpGroupRepository.findChatsById(mcpId);
  }

  async sendUserMessage(mcpGroupId: string, message: string) {
    const allChats = await this.mcpGroupRepository.findChatsById(mcpGroupId);
    const allMcps = await this.mcpService.getMcpList();

    const chatHistory = [
      ...allChats.map(chat => ({
        role:    chat.role === McpChatRole.USER ? 'user' : 'assistant',
        content: chat.message,
      })), {
        role:    'user',
        content: message,
      },
    ];

    this.logger.log(`MCP Group Chat history: ${JSON.stringify(chatHistory)}`);

    const mcpRequestList = allMcps.map(mcp => ({
      id:          mcp.id,
      description: mcp.description,
    }));

    this.logger.log(`MCP Group Request list: ${JSON.stringify(mcpRequestList)}`);

    const httpResponse = await firstValueFrom(this.httpService.post('https://mcp.ruha.uno/api/ai/mcp_group', {
      chat_history: chatHistory,
      user_input:   message,
      mcp_list:     mcpRequestList,
    }));

    this.logger.log(`MCP Group HTTP response: ${JSON.stringify(httpResponse.data)}`);

    const response: {
      mcp_list:       {
        id:          string;
        description: string;
      }[];
      description: string;
    } = httpResponse.data;

    await this.mcpGroupRepository.sendMessage(mcpGroupId, message, McpChatRole.USER);

    const assistantMessage = await this.mcpGroupRepository.sendMessage(mcpGroupId, response.description, McpChatRole.ASSISTANT);

    await this.mcpGroupRepository.updateMcpGroup(mcpGroupId, {
      description: response.description,
      mcpIds:      response.mcp_list.map(mcp => mcp.id),
    });

    return assistantMessage;
  }

  async createMcpGroupByChoice(dto: CreateMcpGroupByChoiceRequestDto, userId: string) {
    const response = {
      id:          dto.id,
      mcpIds:      dto.mcpIds,
      description: dto.description,
      ownerId:     userId,
    };

    const mcp = await this.mcpGroupRepository.createMcpGroup(response);

    return mcp;
  }

  async createMcpGroupByNl(dto: CreateMcpGroupByNlRequestDto, userId: string) {
    const existingGroup = await this.mcpGroupRepository.findMcpGroupById(dto.id);

    let mcp;

    if (existingGroup) {
      mcp = existingGroup;
    } else {
      const response = {
        id:      dto.id,
        mcpIds:  [],
        ownerId: userId,
      };

      mcp = await this.mcpGroupRepository.createMcpGroup(response);
    }

    await this.sendUserMessage(mcp.id, dto.prompt);

    return mcp;
  }

  async deployMcpGroup(mcpGroupId: string) {
    const mcpGroup = await this.mcpGroupRepository.findMcpGroupById(mcpGroupId);

    if (!mcpGroup) {
      throw new BadRequestException('MCP Group Not Found');
    }

    const httpResponse = await firstValueFrom(this.httpService.post('https://mcp.ruha.uno/api/mcp_group/create_mcp_group', {
      id: mcpGroupId, mcp_list: mcpGroup.mcps.map(mcp => mcp.id),
    }));

    const response: {
      deploy_url: string;
    } = httpResponse.data;

    await this.mcpGroupRepository.setMcpGroupDeployed(mcpGroupId, response.deploy_url);

    return { deployUrl: response.deploy_url };
  }

  async getMcpGroupById(mcpGroupId: string) {
    return this.mcpGroupRepository.findMcpGroupById(mcpGroupId);
  }
}
