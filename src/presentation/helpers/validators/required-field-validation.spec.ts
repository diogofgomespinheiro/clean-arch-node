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
});
