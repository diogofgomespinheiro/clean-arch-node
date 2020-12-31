import { SignUpController } from '@/presentation/controllers';
import {
  MissingParamError,
  ServerError,
  EmailInUseError
} from '@/presentation/errors';
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers';
import { throwNullStackError } from '@/tests/domain/mocks';
import { AddAccountSpy, AuthenticationSpy } from '@/tests/presentation/mocks';
import { ValidationSpy } from '@/tests/validation/mocks';
import faker from 'faker';

const mockRequest = (): SignUpController.Request => {
  const password = faker.internet.password();
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password
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
    const request = mockRequest();

    await sut.handle(request);
    expect(addAccountSpy.addAccountParams).toEqual({
      name: request.name,
      email: request.email,
      password: request.password
    });
  });

  it('should return 500 if AddAccount throws an exception', async () => {
    const { sut, addAccountSpy } = makeSut();

    jest
      .spyOn(addAccountSpy, 'add')
      .mockImplementationOnce(throwNullStackError);

    const request = mockRequest();

    const httpResponse = await sut.handle(request);
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
    const request = mockRequest();

    const httpResponse = await sut.handle(request);
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

  it('should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut();

    const request = mockRequest();

    await sut.handle(request);

    const { email, password } = request;
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
