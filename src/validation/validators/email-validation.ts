import { InvalidParamError } from '@/presentation/errors';
import { CustomError, Validation } from '@/presentation/protocols';
import { EmailValidator } from '@/validation/protocols/email-validator';

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
