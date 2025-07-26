import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/modules/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      omit:  { password: true },
    });
  }

  async getUserByIdWithPassword(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' }, omit: { password: true },
    });
  }

  async deleteUserById(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
