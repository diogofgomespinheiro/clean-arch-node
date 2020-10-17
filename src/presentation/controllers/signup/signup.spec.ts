import { SignUpController } from './signup';
import {
  InvalidParamError,
  MissingParamError,
  ServerError
} from '@/presentation/errors';
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  EmailValidator,
  Validation
} from './signup-protocols';
import { HttpRequest } from '@/presentation/protocols';
import {
  badRequest,
  ok,
  serverError
} from '@/presentation/helpers/http-helper';

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
});
interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
  validationStub: Validation;
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      return makeFakeAccount();
    }
  }
  return new AddAccountStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(data: any): Error {
      return null;
    }
  }

  return new ValidationStub();
};

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
});

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const sut = new SignUpController(
    emailValidatorStub,
    addAccountStub,
    validationStub
  );

  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    validationStub
  };
};

describe('SignUp Controller', () => {
  it('should return 400 if the name it`s not provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')));
  });

  it('should return 400 if the email it`s not provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  it('should return 400 if the password it`s not provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        passwordConfirmation: 'any_password'
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  it('should return 400 if the passwordConfirmation it`s not provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password'
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('passwordConfirmation'))
    );
  });

  it('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  it('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });

  it('should return 500 if EmailValidator throws an exception', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      const error = new Error();
      error.stack = null;
      throw error;
    });

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  it('should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError('passwordConfirmation'))
    );
  });

  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();

    const addSpy = jest.spyOn(addAccountStub, 'add');

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    });
  });

  it('should return 500 if AddAccount throws an exception', async () => {
    const { sut, addAccountStub } = makeSut();

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      const error = new Error();
      error.stack = null;
      throw error;
    });

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  it('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });

  it('should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
