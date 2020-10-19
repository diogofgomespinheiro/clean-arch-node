import { Authentication, HttpRequest, Validation } from './login-protocols';
import { LoginController } from './login';
import {
  badRequest,
  serverError,
  unauthorized,
  ok
} from '@/presentation/helpers/http/http-helper';
import { MissingParamError, ServerError } from '@/presentation/errors';
import { CustomError } from '@/presentation/protocols/custom-error';
import { AuthenticationModel } from '@/domain/useCases/authentication';

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
});

interface SutType {
  sut: LoginController;
  validationStub: Validation;
  authenticationStub: Authentication;
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(data: any): CustomError {
      return null;
    }
  }

  return new ValidationStub();
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationModel): Promise<string> {
      return 'any_token';
    }
  }

  return new AuthenticationStub();
};

const makeSut = (): SutType => {
  const validationStub = makeValidation();
  const authenticationStub = makeAuthentication();
  const sut = new LoginController(authenticationStub, validationStub);
  return { sut, validationStub, authenticationStub };
};

describe('Login Controller', () => {
  it('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    const { email, password } = httpRequest.body;
    expect(authSpy).toHaveBeenCalledWith({ email, password });
  });

  it('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      return null;
    });

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(unauthorized());
  });

  it('should return 500 if Authentication throws an exception', async () => {
    const { sut, authenticationStub } = makeSut();

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      const error = new Error();
      error.stack = null;
      throw error;
    });

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  it('should return 200 if all credentials are provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }));
  });

  it('should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return 400 if validation return an error', async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'));

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any_field'))
    );
  });
});
