import { MissingParamError } from '@/presentation/errors';
import { RequiredFieldValidation } from '@/validation/validators';
import faker from 'faker';

const field = faker.random.word();

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation(field);
};

describe('Required Field Validation', () => {
  it('should return a MissingParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({ name: faker.random.word() });

    expect(error).toEqual(new MissingParamError(field));
  });

  it('should not return if validation succeds', () => {
    const sut = makeSut();
    const error = sut.validate({ [field]: faker.random.word() });

    expect(error).toBeFalsy();
  });
});
