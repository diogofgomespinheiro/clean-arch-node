import { badRequest } from '@/presentation/helpers/http-helper';
import { EmailValidator } from '@/presentation/protocols/email-validator';
import { LoginController } from './login';
import { InvalidParamError, MissingParamError } from '@/presentation/errors';
import { HttpRequest } from '@/presentation/protocols';

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
});

interface SutType {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
}
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new LoginController(emailValidatorStub);
  return { sut, emailValidatorStub };
};

describe('Login Controller', () => {
  it('Should return 400 if email is not provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  it('Should return 400 if password is not provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  it('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });
});