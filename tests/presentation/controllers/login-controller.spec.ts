import { LoginController } from '@/presentation/controllers';
import {
  badRequest,
  serverError,
  unauthorized,
  ok
} from '@/presentation/helpers';
import { MissingParamError, ServerError } from '@/presentation/errors';
import { throwNullStackError } from '@/tests/domain/mocks';
import { AuthenticationSpy } from '@/tests/presentation/mocks';
import { ValidationSpy } from '@/tests/validation/mocks';
import faker from 'faker';

const mockRequest = (): LoginController.Request => ({
  email: faker.internet.email(),
  password: faker.internet.password()
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
    const request = mockRequest();

    await sut.handle(request);

    const { email, password } = request;
    expect(authenticationSpy.authenticationParams).toEqual({ email, password });
  });

  it('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut();
    authenticationSpy.authenticationModel = null;

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
    expect(httpResponse).toEqual(ok(authenticationSpy.authenticationModel));
  });

  it('should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut();

    const request = mockRequest();

    await sut.handle(request);
    expect(validationSpy.input).toEqual(request);
  });

  it('should return 400 if validation return an error', async () => {
    const { sut, validationSpy } = makeSut();
    const field = faker.random.word();
    validationSpy.error = new MissingParamError(field);

    const request = mockRequest();

    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(badRequest(new MissingParamError(field)));
  });
});
