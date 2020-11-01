import {
  HttpRequest,
  HttpResponse,
  Middleware
} from '@/presentation/protocols';
import { AccessDeniedError } from '@/presentation/errors';
import { forbidden, ok } from '@/presentation/helpers/http/http-helper';
import { LoadAccountByToken } from '@/domain/useCases/load-account-by-token';

export class AuthMiddleware implements Middleware {
  constructor(private readonly loadAccountByToken: LoadAccountByToken) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token'];

    if (!accessToken) return forbidden(new AccessDeniedError());

    const account = await this.loadAccountByToken.load(accessToken);

    if (!account) return forbidden(new AccessDeniedError());

    return ok({ accountId: account.id });
  }
}
