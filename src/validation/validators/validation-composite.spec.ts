import { MissingParamError } from '@/presentation/errors';
import { mockValidation } from '@/validation/test';
import { Validation } from '@/presentation/protocols';
import { ValidationComposite } from './validation-composite';

type SutTypes = {
  sut: ValidationComposite;
  validationStubs: Validation[];
};

const makeSut = (): SutTypes => {
  const validationStubs = [mockValidation(), mockValidation()];
  const sut = new ValidationComposite(validationStubs);

  return {
    sut,
    validationStubs
  };
};

describe('Validation Composite', () => {
  it('should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut();
    jest
      .spyOn(validationStubs[0], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));

    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new MissingParamError('field'));
  });

  it('should return the first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut();
    jest
      .spyOn(validationStubs[0], 'validate')
      .mockReturnValueOnce(new MissingParamError('firstField'));
    jest
      .spyOn(validationStubs[0], 'validate')
      .mockReturnValueOnce(new MissingParamError('secondField'));

    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new MissingParamError('firstField'));
  });

  it('should not return if validation succeds', () => {
    const { sut } = makeSut();

    const error = sut.validate({ field: 'any_value' });

    expect(error).toBeFalsy();
  });
});
