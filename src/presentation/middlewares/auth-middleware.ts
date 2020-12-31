/* eslint-disable import/export */
/* eslint-disable no-redeclare */
import { HttpResponse, Middleware } from '@/presentation/protocols';
import { LoadAccountByToken } from '@/domain/useCases';
import { AccessDeniedError } from '@/presentation/errors';
import { forbidden, ok, serverError } from '@/presentation/helpers';

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle(request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { accessToken } = request;

      if (!accessToken) return forbidden(new AccessDeniedError());

      const account = await this.loadAccountByToken.load(
        accessToken,
        this.role
      );

      if (!account) return forbidden(new AccessDeniedError());

      return ok({ accountId: account.id });
    } catch (error) {
      return serverError(error);
    }
  }
}

export namespace AuthMiddleware {
  export type Request = {
    accessToken?: string;
  };
}
