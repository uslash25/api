import { Injectable, NotFoundException } from '@nestjs/common';
import { LogService } from '@/common/modules/log';
import { hashPassword } from '@/common/utils/bcrypt';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private readonly authService: AuthService, private readonly logger: LogService) {
  }

  async create(dto: CreateUserDto) {
    dto.password = await hashPassword(dto.password);

    const user = await this.userRepository.createUser(dto);

    this.logger.log('User', `Successfully created user (id: ${user.id})`);

    return user;
  }

  async deleteUser(userId: string) {
    const foundUser = await this.userRepository.getUserById(userId);

    if (!foundUser) {
      throw new NotFoundException('User not found.');
    }

    await this.userRepository.deleteUserById(userId);

    this.logger.log('User', 'Successfully deleted user (id: ' + userId + ')');

    return true;
  }

  async getAllUsers() {
    const users = await this.userRepository.getAllUsers();

    return users;
  }

  async getUserById(userId: string) {
    return await this.userRepository.getUserById(userId);
  }
}
