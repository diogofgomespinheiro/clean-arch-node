import { AuthMiddleware } from '@/presentation/middlewares';
import { makeDbLoadAccountByToken } from '@/main/factories';
import { Middleware } from '@/presentation/protocols';

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeDbLoadAccountByToken(), role);
};
