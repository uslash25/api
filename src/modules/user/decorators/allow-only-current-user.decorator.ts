import { applyDecorators, UseGuards } from '@nestjs/common';
import { Authenticated } from '@/modules/auth/decorators/auth.decorator';
import { AllowUserOnlyCurrentUserGuard } from '../guards/allow-only-current-user.guard';

export function AllowUserOnlyCurrentUser() {
  return applyDecorators(Authenticated(), UseGuards(AllowUserOnlyCurrentUserGuard));
}
