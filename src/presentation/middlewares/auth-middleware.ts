import {
  HttpRequest,
  HttpResponse,
  Middleware
} from '@/presentation/protocols';
import { AccessDeniedError } from '@/presentation/errors';
import {
  forbidden,
  ok,
  serverError
} from '@/presentation/helpers/http/http-helper';
import { LoadAccountByToken } from '@/domain/useCases/load-account-by-token';

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token'];

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
