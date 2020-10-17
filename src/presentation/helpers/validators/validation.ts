import { CustomError } from '@/presentation/protocols/custom-error';

export interface Validation {
  validate(input: any): CustomError;
}
