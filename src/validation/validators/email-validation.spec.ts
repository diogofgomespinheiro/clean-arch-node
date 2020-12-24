import { EmailValidation } from './email-validation';
import { InvalidParamError } from '@/presentation/errors';
import { EmailValidatorSpy } from '@/validation/test';
import { throwNullStackError } from '@/domain/test/test-helper';
import faker from 'faker';

type SutTypes = {
  sut: EmailValidation;
  emailValidatorSpy: EmailValidatorSpy;
};

const makeSut = (): SutTypes => {
  const emailValidatorSpy = new EmailValidatorSpy();
  const sut = new EmailValidation('email', emailValidatorSpy);

  return {
    sut,
    emailValidatorSpy
  };
};

describe('Email Validation', () => {
  it('should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorSpy } = makeSut();
    emailValidatorSpy.isEmailValid = false;

    const error = sut.validate({ email: 'any_email@mail.com' });

    expect(error).toEqual(new InvalidParamError('email'));
  });

  it('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorSpy } = makeSut();
    const email = faker.internet.email();
    sut.validate({ email });
    expect(emailValidatorSpy.email).toBe(email);
  });

  it('should throw if EmailValidator throws an exception', async () => {
    const { sut, emailValidatorSpy } = makeSut();

    jest
      .spyOn(emailValidatorSpy, 'isValid')
      .mockImplementationOnce(throwNullStackError);

    expect(sut.validate).toThrow();
  });
});
