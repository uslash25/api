import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { McpChatRole } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { McpService } from '../mcp/mcp.service';
import { CreateMcpGroupByChoiceRequestDto } from './dto/create-mcp-group-by-choice-request.dto';
import { CreateMcpGroupByNlRequestDto } from './dto/create-mcp-group-by-nl-request.dto';
import { McpGroupRepository } from './mcp-group.repository';

@Injectable()
export class McpGroupService {
  constructor(private readonly mcpGroupRepository: McpGroupRepository,
    private readonly httpService: HttpService,
    private readonly mcpService: McpService) {
  }

  async getChats(mcpId: string) {
    return this.mcpGroupRepository.findChatsById(mcpId);
  }

  async sendUserMessage(mcpGroupId: string, message: string) {
    const allChats = await this.mcpGroupRepository.findChatsById(mcpGroupId);
    const allMcps = await this.mcpService.getMcpList();

    const chatHistory = [
      ...allChats.map(chat => ({
        role:    chat.role,
        content: chat.message,
      })), {
        role:    McpChatRole.USER,
        content: message,
      },
    ];

    const mcpRequestList = allMcps.map(mcp => ({
      Id:          mcp.id,
      description: mcp.description,
    }));

    const httpResponse = await firstValueFrom(this.httpService.post('https://mcp.ruha.uno/api/ai/mcp_group', {
      Chat_history: chatHistory,
      user_input:   message,
      mcp_list:     mcpRequestList,
    }));

    const response: {
      mcp_list:       {
        Id:          string;
        description: string;
      }[];
      description: string;
    } = httpResponse.data;

    const chat = await this.mcpGroupRepository.sendMessage(mcpGroupId, message, McpChatRole.USER);
    const assistantMessage = await this.mcpGroupRepository.sendMessage(mcpGroupId, response.description, McpChatRole.ASSISTANT);

    await this.mcpGroupRepository.updateMcpGroup(mcpGroupId, {
      description: response.description,
      mcpIds:      response.mcp_list.map(mcp => mcp.Id),
    });

    return {
      chat,
      assistantMessage,
    };
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
    const response = {
      id:      dto.id,
      mcpIds:  [],
      ownerId: userId,
    };

    const mcp = await this.mcpGroupRepository.createMcpGroup(response);

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

    await this.mcpGroupRepository.setMcpGroupDeployed(mcpGroupId);

    return { deployUrl: response.deploy_url };
  }

  async getMcpGroupById(mcpGroupId: string) {
    return this.mcpGroupRepository.findMcpGroupById(mcpGroupId);
  }
}
