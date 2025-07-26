import { Injectable } from '@nestjs/common';
import { McpChatRole } from '@prisma/client';
import { PrismaService } from '@/common/modules/prisma';
import { CreateMcpDto } from './dto/create-mcp.dto';

@Injectable()
export class McpRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async findChatsById(mcpId: string) {
    return this.prisma.mcpChat.findMany({
      where: { mcpId }, orderBy: { createdAt: 'asc' },
    });
  }

  async sendMessage(mcpId: string, message: string, role: McpChatRole) {
    return this.prisma.mcpChat.create({ data: {
      mcpId,
      message,
      role,
    } });
  }

  async updateMcpDescription(mcpId: string, description: string) {
    return this.prisma.mcp.update({
      where: { id: mcpId },
      data:  { description },
    });
  }

  async createMcp(mcp: CreateMcpDto) {
    return this.prisma.mcp.create({ data: mcp });
  }

  async findAllMcps() {
    return this.prisma.mcp.findMany({ include: { owner: { omit: { password: true } } } });
  }

  async findAllMcpGroups() {
    return this.prisma.mcpGroup.findMany({ include: { owner: { omit: { password: true } } } });
  }

  async findMcpById(mcpId: string) {
    return this.prisma.mcp.findUnique({
      where: { id: mcpId }, include: { owner: { omit: { password: true } } },
    });
  }
}
