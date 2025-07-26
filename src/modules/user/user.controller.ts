import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200, description: 'Current user profile',
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized',
  })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200, description: 'User profile',
  })
  @ApiResponse({
    status: 401, description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404, description: 'User not found',
  })
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
