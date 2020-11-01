import { CustomError } from '@/presentation/protocols';

export class AccessDeniedError extends CustomError {
  constructor() {
    super('Access denied');
    this.name = 'AccessDeniedError';

    Object.setPrototypeOf(this, AccessDeniedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message, name: this.name }];
  }
}
