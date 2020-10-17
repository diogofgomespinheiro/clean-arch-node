import { InvalidParamError } from '@/presentation/errors';
import { CompareFieldsValidation } from './compare-fields-validation';

const makeSut = (
  fieldName = 'field',
  fieldToCompare = 'fieldToCompare'
): CompareFieldsValidation => {
  return new CompareFieldsValidation(fieldName, fieldToCompare);
};

describe('Compare Fields Validation', () => {
  it('should return an InvalidParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'wrong_value'
    });

    expect(error).toEqual(new InvalidParamError('fieldToCompare'));
  });

  it('should not return if validation succeds', () => {
    const sut = makeSut();
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value'
    });

    expect(error).toBeFalsy();
  });
});
