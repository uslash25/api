import { Injectable } from '@nestjs/common';
import { McpChatRole } from '@prisma/client';
import { PrismaService } from '@/common/modules/prisma';
import { CreateMcpGroupDto } from './dto/create-mcp-group.dto';
import { UpdateMcpGroupDto } from './dto/update-mcp-group.dto';

@Injectable()
export class McpGroupRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async findChatsById(mcpGroupId: string) {
    return this.prisma.mcpGroupChat.findMany({
      where: { mcpGroupId }, orderBy: { createdAt: 'asc' },
    });
  }

  async sendMessage(mcpGroupId: string, message: string, role: McpChatRole) {
    return this.prisma.mcpGroupChat.create({ data: {
      mcpGroupId,
      message,
      role,
    } });
  }

  async updateMcpGroup(mcpGroupId: string, dto: UpdateMcpGroupDto) {
    return this.prisma.mcpGroup.update({
      where: { id: mcpGroupId },
      data:  {
        description: dto.description,
        mcps:        { set: dto.mcpIds.map(mcpId => ({ id: mcpId })) },
      },
    });
  }

  async createMcpGroup(mcp: CreateMcpGroupDto) {
    return this.prisma.mcpGroup.create({ data: mcp });
  }
}
