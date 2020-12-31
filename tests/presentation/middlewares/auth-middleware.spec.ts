import { AccessDeniedError, ServerError } from '@/presentation/errors';
import { forbidden, ok, serverError } from '@/presentation/helpers';
import { AuthMiddleware } from '@/presentation/middlewares';
import { throwNullStackError } from '@/tests/domain/mocks';
import { LoadAccountByTokenSpy } from '@/tests/presentation/mocks';
import faker from 'faker';

const mockRequest = (): AuthMiddleware.Request => ({
  accessToken: faker.random.uuid()
});

type SutTypes = {
  sut: AuthMiddleware;
  loadAccountByTokenSpy: LoadAccountByTokenSpy;
};

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenSpy = new LoadAccountByTokenSpy();
  const sut = new AuthMiddleware(loadAccountByTokenSpy, role);

  return { sut, loadAccountByTokenSpy };
};

describe('Auth Middleware', () => {
  it('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  it('should call LoadAccountByToken with correct values', async () => {
    const role = faker.random.word();
    const { sut, loadAccountByTokenSpy } = makeSut(role);

    const request = mockRequest();
    await sut.handle(request);

    expect(loadAccountByTokenSpy.accessToken).toBe(request.accessToken);
    expect(loadAccountByTokenSpy.role).toBe(role);
  });

  it('should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut();
    loadAccountByTokenSpy.accountModel = null;

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  it('should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut();

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(
      ok({ accountId: loadAccountByTokenSpy.accountModel.id })
    );
  });

  it('should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut();
    jest
      .spyOn(loadAccountByTokenSpy, 'load')
      .mockImplementationOnce(throwNullStackError);

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });
});
