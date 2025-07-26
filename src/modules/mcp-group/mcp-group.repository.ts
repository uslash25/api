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
    const { mcpIds, ...rest } = mcp;

    return this.prisma.mcpGroup.create({ data: {
      ...rest,
      mcps: { connect: mcpIds.map(mcpId => ({ id: mcpId })) },
    } });
  }

  async findMcpGroupById(mcpGroupId: string) {
    return this.prisma.mcpGroup.findUnique({
      where:   { id: mcpGroupId },
      include: {
        mcps: true, owner: { omit: { password: true } },
      },
    });
  }

  async setMcpGroupDeployed(mcpGroupId: string) {
    return this.prisma.mcpGroup.update({
      where: { id: mcpGroupId },
      data:  { deployed: true },
    });
  }
}
