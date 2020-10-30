import { CustomError } from '@/presentation/protocols';

export interface Validation {
  validate(input: any): CustomError;
}
