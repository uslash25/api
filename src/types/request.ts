import { User } from '@prisma/client';
import { Request } from 'express';

export interface AuthorizedRequest extends Request {
  user: Omit<User, 'password'>;
}
