import { CustomError } from '@/presentation/protocols/custom-error';

export class ServerError extends CustomError {
  constructor() {
    super('Internal server error');
    this.name = 'ServerError';

    Object.setPrototypeOf(this, ServerError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message, name: this.name }];
  }
}
