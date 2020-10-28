import { CustomError } from '@/presentation/protocols/custom-error';

export class EmailInUseError extends CustomError {
  private readonly paramName = 'email';

  constructor() {
    super('The received email is already in use');
    this.name = 'EmailInUseError';

    Object.setPrototypeOf(this, EmailInUseError.prototype);
  }

  serializeErrors() {
    return [{ field: this.paramName, message: this.message, name: this.name }];
  }
}
