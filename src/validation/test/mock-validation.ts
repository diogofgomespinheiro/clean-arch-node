import { CustomError, Validation } from '@/presentation/protocols';

export const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(data: any): CustomError {
      return null;
    }
  }

  return new ValidationStub();
};
