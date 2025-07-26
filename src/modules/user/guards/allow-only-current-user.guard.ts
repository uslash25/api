import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthorizedRequest } from '@/types/request';

@Injectable()
export class AllowUserOnlyCurrentUserGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthorizedRequest>();
    const user = request.user;
    const userId = request.params.userId;

    return user.id === userId;
  }
}
