import { AccessDeniedError, ServerError } from '@/presentation/errors';
import {
  forbidden,
  ok,
  serverError
} from '@/presentation/helpers/http/http-helper';
import { HttpRequest, LoadAccountByToken } from './auth-middleware-protocols';
import { AuthMiddleware } from './auth-middleware';
import { mockAccountModel } from '@/domain/test';
import { throwNullStackError } from '@/domain/test/test-helper';
import { mockLoadAccountByToken } from '@/presentation/test';

const mockRequest = (): HttpRequest => {
  return {
    headers: {
      'x-access-token': 'any_token'
    }
  };
};

type SutTypes = {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByToken;
};

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub, role);

  return { sut, loadAccountByTokenStub };
};

describe('Auth Middleware', () => {
  it('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  it('should call LoadAccountByToken with correct values', async () => {
    const role = 'any_role';
    const { sut, loadAccountByTokenStub } = makeSut(role);
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');

    const httpRequest = mockRequest();
    await sut.handle(httpRequest);

    expect(loadSpy).toHaveBeenCalledWith(
      httpRequest.headers['x-access-token'],
      role
    );
  });

  it('should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenStub, 'load')
      .mockImplementationOnce(async () => null);

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  it('should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(ok({ accountId: mockAccountModel().id }));
  });

  it('should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenStub, 'load')
      .mockImplementationOnce(throwNullStackError);

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });
});
