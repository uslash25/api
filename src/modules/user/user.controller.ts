import { Controller, Get, Param } from '@nestjs/common';
import { User } from '@prisma/client';
import { Authenticated, CurrentUser } from '../auth/decorators/auth.decorator';
import { AllowUserOnlyCurrentUser } from './decorators/allow-only-current-user.decorator';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get('/me')
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
