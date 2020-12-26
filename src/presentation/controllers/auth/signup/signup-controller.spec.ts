import { SignUpController } from './signup-controller';
import { MissingParamError, ServerError } from '@/presentation/errors';
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
import { ValidationSpy } from '@/validation/test';
import faker from 'faker';

const mockRequest = (): HttpRequest => {
  const password = faker.internet.password();
  return {
    body: {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
      passwordConfirmation: password
    }
  };
};

type SutTypes = {
  sut: SignUpController;
  addAccountSpy: AddAccountSpy;
  validationSpy: ValidationSpy;
  authenticationSpy: AuthenticationSpy;
};

const makeSut = (): SutTypes => {
  const addAccountSpy = new AddAccountSpy();
  const authenticationSpy = new AuthenticationSpy();
  const validationSpy = new ValidationSpy();
  const sut = new SignUpController(
    addAccountSpy,
    validationSpy,
    authenticationSpy
  );

  return {
    sut,
    addAccountSpy,
    validationSpy,
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
