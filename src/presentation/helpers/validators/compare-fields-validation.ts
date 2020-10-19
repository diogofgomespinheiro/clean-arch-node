import { InvalidParamError } from '@/presentation/errors';
import { CustomError } from '@/presentation/protocols/custom-error';
import { Validation } from '../../protocols/validation';

export class CompareFieldsValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldToCompareName: string
  ) {}

  validate(data: any): CustomError {
    if (data[this.fieldName] !== data[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName);
    }
  }
}
