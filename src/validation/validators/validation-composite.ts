import { CustomError, Validation } from '@/presentation/protocols';

export class ValidationComposite implements Validation {
  constructor(private readonly validations: Validation[]) {}

  validate(data: any): CustomError {
    for (const validation of this.validations) {
      const error = validation.validate(data);

      if (error) {
        return error;
      }
    }
  }
}
