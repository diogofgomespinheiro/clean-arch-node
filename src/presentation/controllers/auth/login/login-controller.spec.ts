import { HttpRequest } from './login-protocols';
import { LoginController } from './login-controller';
import {
  badRequest,
  serverError,
  unauthorized,
  ok
} from '@/presentation/helpers/http/http-helper';
import { MissingParamError, ServerError } from '@/presentation/errors';
import { throwNullStackError } from '@/domain/test/test-helper';
import { AuthenticationSpy } from '@/presentation/test';
import { ValidationSpy } from '@/validation/test';
import faker from 'faker';

const mockRequest = (): HttpRequest => ({
  body: {
    email: faker.internet.email(),
    password: faker.internet.password()
  }
});

type SutTypes = {
  sut: LoginController;
  validationSpy: ValidationSpy;
  authenticationSpy: AuthenticationSpy;
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const authenticationSpy = new AuthenticationSpy();
  const sut = new LoginController(authenticationSpy, validationSpy);
  return { sut, validationSpy, authenticationSpy };
};

describe('Login Controller', () => {
  it('should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut();
    const httpRequest = mockRequest();

    await sut.handle(httpRequest);

    const { email, password } = httpRequest.body;
    expect(authenticationSpy.authenticationParams).toEqual({ email, password });
  });

  it('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut();
    authenticationSpy.token = null;

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(unauthorized());
  });

  it('should return 500 if Authentication throws an exception', async () => {
    const { sut, authenticationSpy } = makeSut();

    jest
      .spyOn(authenticationSpy, 'auth')
      .mockImplementationOnce(throwNullStackError);

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  it('should return 200 if all credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut();

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok({ accessToken: authenticationSpy.token }));
  });

  it('should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut();

    const httpRequest = mockRequest();

    await sut.handle(httpRequest);
    expect(validationSpy.input).toEqual(httpRequest.body);
  });

  it('should return 400 if validation return an error', async () => {
    const { sut, validationSpy } = makeSut();
    const field = faker.random.word();
    validationSpy.error = new MissingParamError(field);

    const httpRequest = mockRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError(field)));
  });
});
