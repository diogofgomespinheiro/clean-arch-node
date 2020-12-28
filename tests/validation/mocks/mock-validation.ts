import { CustomError, Validation } from '@/presentation/protocols';

export class ValidationSpy implements Validation {
  error: CustomError = null;
  input: any;

  validate(input: any): CustomError {
    this.input = input;
    return this.error;
  }
}
