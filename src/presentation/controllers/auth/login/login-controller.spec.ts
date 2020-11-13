import { Authentication, HttpRequest, Validation } from './login-protocols';
import { LoginController } from './login-controller';
import {
  badRequest,
  serverError,
  unauthorized,
  ok
} from '@/presentation/helpers/http/http-helper';
import { MissingParamError, ServerError } from '@/presentation/errors';
import { throwNullStackError } from '@/domain/test/test-helper';
import { mockAuthentication } from '@/presentation/test';
import { mockValidation } from '@/validation/test';

const mockRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
});

type SutTypes = {
  sut: LoginController;
  validationStub: Validation;
  authenticationStub: Authentication;
};

const makeSut = (): SutTypes => {
  const validationStub = mockValidation();
  const authenticationStub = mockAuthentication();
  const sut = new LoginController(authenticationStub, validationStub);
  return { sut, validationStub, authenticationStub };
};

describe('Login Controller', () => {
  it('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');

    const httpRequest = mockRequest();

    await sut.handle(httpRequest);

    const { email, password } = httpRequest.body;
    expect(authSpy).toHaveBeenCalledWith({ email, password });
  });

  it('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      return null;
    });

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(unauthorized());
  });

  it('should return 500 if Authentication throws an exception', async () => {
    const { sut, authenticationStub } = makeSut();

    jest
      .spyOn(authenticationStub, 'auth')
      .mockImplementationOnce(throwNullStackError);

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  it('should return 200 if all credentials are provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }));
  });

  it('should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = mockRequest();

    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return 400 if validation return an error', async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'));

    const httpRequest = mockRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any_field'))
    );
  });
});
