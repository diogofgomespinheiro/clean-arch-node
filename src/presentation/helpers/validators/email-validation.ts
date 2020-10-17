import { InvalidParamError } from '@/presentation/errors';
import { CustomError } from '@/presentation/protocols/custom-error';
import { EmailValidator } from '@/presentation/protocols/email-validator';
import { Validation } from './validation';

export class EmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate(data: any): CustomError {
    const isValid = this.emailValidator.isValid(data[this.fieldName]);

    if (!isValid) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
