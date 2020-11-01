import { AccessDeniedError } from '@/presentation/errors';
import { forbidden } from '@/presentation/helpers/http/http-helper';
import { HttpRequest } from '@/presentation/protocols';
import { AuthMiddleware } from './auth-middleware';
import { LoadAccountByToken } from '@/domain/useCases/load-account-by-token';
import { AccountModel } from '@/domain/models/account';

const makeFakeRequest = (): HttpRequest => {
  return {
    headers: {
      'x-access-token': 'any_token'
    }
  };
};

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
});

interface SutTypes {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByToken;
}

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return makeFakeAccount();
    }
  }

  return new LoadAccountByTokenStub();
};

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub);

  return { sut, loadAccountByTokenStub };
};

describe('Auth Middleware', () => {
  it('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  it('should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();

    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');
    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(loadSpy).toHaveBeenCalledWith(httpRequest.headers['x-access-token']);
  });
});