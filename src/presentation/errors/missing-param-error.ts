import { CustomError } from '@/presentation/protocols/custom-error';

export class MissingParamError extends CustomError {
  constructor(private readonly paramName: string) {
    super(`Missing param: ${paramName}`);
    this.name = 'MissingParamError';

    Object.setPrototypeOf(this, MissingParamError.prototype);
  }

  serializeErrors() {
    return [{ field: this.paramName, message: this.message, name: this.name }];
  }
}
