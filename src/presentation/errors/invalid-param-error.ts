import { CustomError } from '@/presentation/protocols/custom-error';

export class InvalidParamError extends CustomError {
  constructor(private readonly paramName: string) {
    super(`Invalid param: ${paramName}`);
    this.name = 'InvalidParamError';

    Object.setPrototypeOf(this, InvalidParamError.prototype);
  }

  serializeErrors() {
    return [{ field: this.paramName, message: this.message, name: this.name }];
  }
}
