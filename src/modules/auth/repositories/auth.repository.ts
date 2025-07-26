import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/modules/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async findUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      omit:  { password: true },
    });
  }

  async findUserByUsername(username: string) {
    return await this.prisma.user.findUnique({ where: { username } });
  }
}
