import { MissingParamError } from '@/presentation/errors';
import { RequiredFieldValidation } from './required-field-validation';

const makeSut = (fieldName = 'field'): RequiredFieldValidation => {
  return new RequiredFieldValidation(fieldName);
};

describe('Required Field Validation', () => {
  it('should return a MissingParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({ name: 'any_name' });

    expect(error).toEqual(new MissingParamError('field'));
  });

  it('should not return if validation succeds', () => {
    const sut = makeSut();
    const error = sut.validate({ field: 'any_name' });

    expect(error).not.toBeTruthy();
  });
});
