import { CustomError } from '@/presentation/protocols';

export class ServerError extends CustomError {
  constructor(stack: string) {
    super('Internal server error');
    this.name = 'ServerError';
    this.stack = stack;

    Object.setPrototypeOf(this, ServerError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message, name: this.name, stack: this.stack }];
  }
}
