import { CustomError } from '@/presentation/protocols';

export class UnauthorizedError extends CustomError {
  constructor() {
    super('Unauthorized');
    this.name = 'UnauthorizedError';

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message, name: this.name }];
  }
}
