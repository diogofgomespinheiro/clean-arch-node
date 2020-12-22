import { SignUpController } from './signup-controller';
import { MissingParamError, ServerError } from '@/presentation/errors';
import { Validation } from './signup-protocols';
import { HttpRequest } from '@/presentation/protocols';
import {
  badRequest,
  forbidden,
  ok,
  serverError
} from '@/presentation/helpers/http/http-helper';
import { EmailInUseError } from '@/presentation/errors/email-in-use-error';
import { throwNullStackError } from '@/domain/test/test-helper';
import { AddAccountSpy, AuthenticationSpy } from '@/presentation/test';
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
  addAccountSpy: AddAccountSpy;
  validationStub: Validation;
  authenticationSpy: AuthenticationSpy;
};

const makeSut = (): SutTypes => {
  const addAccountSpy = new AddAccountSpy();
  const authenticationSpy = new AuthenticationSpy();
  const validationStub = mockValidation();
  const sut = new SignUpController(
    addAccountSpy,
    validationStub,
    authenticationSpy
  );

  return {
    sut,
    addAccountSpy,
    validationStub,
    authenticationSpy
  };
};

describe('SignUp Controller', () => {
  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut();
    const httpRequest = mockRequest();

    await sut.handle(httpRequest);
    expect(addAccountSpy.addAccountParams).toEqual({
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password
    });
  });

  it('should return 500 if AddAccount throws an exception', async () => {
    const { sut, addAccountSpy } = makeSut();

    jest
      .spyOn(addAccountSpy, 'add')
      .mockImplementationOnce(throwNullStackError);

    const httpRequest = mockRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  it('should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountSpy } = makeSut();
    addAccountSpy.accountModel = null;

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
  });

  it('should return 200 if valid data is provided', async () => {
    const { sut, authenticationSpy } = makeSut();
    const httpRequest = mockRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok({ accessToken: authenticationSpy.token }));
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
    const { sut, authenticationSpy } = makeSut();

    const httpRequest = mockRequest();

    await sut.handle(httpRequest);

    const { email, password } = httpRequest.body;
    expect(authenticationSpy.authenticationParams).toEqual({ email, password });
  });

  it('should return 500 if Authentication throws an exception', async () => {
    const { sut, authenticationSpy } = makeSut();

    jest
      .spyOn(authenticationSpy, 'auth')
      .mockImplementationOnce(throwNullStackError);

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });
});
