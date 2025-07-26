import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Authenticated, CurrentUser } from '../auth/decorators/auth.decorator';
import { AllowUserOnlyCurrentUser } from './decorators/allow-only-current-user.decorator';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get('/me')
  @ApiBearerAuth()
  @Authenticated()
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
  @ApiBearerAuth()
  @AllowUserOnlyCurrentUser()
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
