import { SignUpController } from './signup-controller';
import { MissingParamError, ServerError } from '@/presentation/errors';
import { AddAccount, Authentication, Validation } from './signup-protocols';
import { HttpRequest } from '@/presentation/protocols';
import {
  badRequest,
  forbidden,
  ok,
  serverError
} from '@/presentation/helpers/http/http-helper';
import { EmailInUseError } from '@/presentation/errors/email-in-use-error';
import { throwNullStackError } from '@/domain/test/test-helper';
import { mockAddAccount, mockAuthentication } from '@/presentation/test';
import { mockValidation } from '@/validation/test';

const mockRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
});
type SutTypes = {
  sut: SignUpController;
  addAccountStub: AddAccount;
  validationStub: Validation;
  authenticationStub: Authentication;
};

const makeSut = (): SutTypes => {
  const addAccountStub = mockAddAccount();
  const authenticationStub = mockAuthentication();
  const validationStub = mockValidation();
  const sut = new SignUpController(
    addAccountStub,
    validationStub,
    authenticationStub
  );

  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  };
};

describe('SignUp Controller', () => {
  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();

    const addSpy = jest.spyOn(addAccountStub, 'add');

    const httpRequest = mockRequest();

    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    });
  });

  it('should return 500 if AddAccount throws an exception', async () => {
    const { sut, addAccountStub } = makeSut();

    jest
      .spyOn(addAccountStub, 'add')
      .mockImplementationOnce(throwNullStackError);

    const httpRequest = mockRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  it('should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(null);

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
  });

  it('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = mockRequest();

    const httpResponse = await sut.handle(httpRequest);
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

  it('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');

    const httpRequest = mockRequest();

    await sut.handle(httpRequest);

    const { email, password } = httpRequest.body;
    expect(authSpy).toHaveBeenCalledWith({ email, password });
  });

  it('should return 500 if Authentication throws an exception', async () => {
    const { sut, authenticationStub } = makeSut();

    jest
      .spyOn(authenticationStub, 'auth')
      .mockImplementationOnce(throwNullStackError);

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });
});
