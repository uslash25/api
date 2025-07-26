import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/modules/prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async createUser(dto: CreateUserDto) {
    return await this.prisma.user.create({
      data: dto,
      omit: { password: true },
    });
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
