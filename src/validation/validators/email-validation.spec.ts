import { InvalidParamError } from '@/presentation/errors';
import { EmailValidator } from '@/validation/protocols/email-validator';
import { EmailValidation } from './email-validation';

type SutTypes = {
  sut: EmailValidation;
  emailValidatorStub: EmailValidator;
};

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new EmailValidation('email', emailValidatorStub);

  return {
    sut,
    emailValidatorStub
  };
};

describe('Email Validation', () => {
  it('should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const error = sut.validate({ email: 'any_email@mail.com' });

    expect(error).toEqual(new InvalidParamError('email'));
  });

  it('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    sut.validate({ email: 'any_email@mail.com' });
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  it('should throw if EmailValidator throws an exception', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      const error = new Error();
      error.stack = null;
      throw error;
    });

    expect(sut.validate).toThrow();
  });
});
