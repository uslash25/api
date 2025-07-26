import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/modules/prisma/prisma.service';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async createUser(dto: CreateUserDto) {
    return await this.prisma.user.create({
      data: dto, omit: { password: true },
    });
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
