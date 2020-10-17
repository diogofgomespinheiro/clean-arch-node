import { MissingParamError } from '@/presentation/errors';
import { CustomError } from '@/presentation/protocols/custom-error';
import { Validation } from './validation';

export class RequiredFieldValidation implements Validation {
  constructor(private readonly fieldName: string) {}

  validate(data: any): CustomError {
    if (!data[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }
  }
}
