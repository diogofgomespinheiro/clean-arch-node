import { MissingParamError } from '@/presentation/errors';
import { ValidationSpy } from '@/tests/validation/mocks/';
import { ValidationComposite } from '@/validation/validators';
import faker from 'faker';

const FIELD = faker.random.word();

type SutTypes = {
  sut: ValidationComposite;
  validationSpies: ValidationSpy[];
};

const makeSut = (): SutTypes => {
  const validationSpies = [new ValidationSpy(), new ValidationSpy()];
  const sut = new ValidationComposite(validationSpies);

  return {
    sut,
    validationSpies
  };
};

describe('Validation Composite', () => {
  it('should return an error if any validation fails', () => {
    const { sut, validationSpies } = makeSut();
    validationSpies[0].error = new MissingParamError(FIELD);

    const error = sut.validate({ field: faker.random.word() });

    expect(error).toEqual(new MissingParamError(FIELD));
  });

  it('should return the first error if more than one validation fails', () => {
    const { sut, validationSpies } = makeSut();
    validationSpies[0].error = new MissingParamError(FIELD);
    validationSpies[1].error = new MissingParamError(faker.random.word());

    const error = sut.validate({ field: faker.random.word() });

    expect(error).toEqual(new MissingParamError(FIELD));
  });

  it('should not return if validation succeds', () => {
    const { sut } = makeSut();

    const error = sut.validate({ field: FIELD });

    expect(error).toBeFalsy();
  });
});
