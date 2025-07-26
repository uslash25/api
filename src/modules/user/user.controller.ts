import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Authenticated, CurrentUser } from '../auth/decorators/auth.decorator';
import { AllowUserOnlyCurrentUser } from './decorators/allow-only-current-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: CreateUserDto) {
    return await this.userService.create(dto);
  }

  @Get('/me')
  @AllowUserOnlyCurrentUser()
  async me(@CurrentUser() user: User) {
    return user;
  }

  /*
   * @Get('/list')
   * @OnlyAdmin()
   * async getAllUsers() {
   *   return await this.userService.getAllUsers();
   * }
   */

  @Get('/:userId')
  @Authenticated()
  async getUserById(@Param('userId') userId: string) {
    return await this.userService.getUserById(userId);
  }

  /*
   * @Delete('/:userId')
   * @AllowUserUpdate()
   * async deleteUser(@Param('userId') userId: string) {
   *   return await this.userService.deleteUser(userId);
   * }
   */
}
