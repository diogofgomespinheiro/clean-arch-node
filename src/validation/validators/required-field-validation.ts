import { MissingParamError } from '@/presentation/errors';
import { CustomError, Validation } from '@/presentation/protocols';

export class RequiredFieldValidation implements Validation {
  constructor(private readonly fieldName: string) {}

  validate(data: any): CustomError {
    if (!data[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }
  }
}
