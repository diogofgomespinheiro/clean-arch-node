/* eslint-disable no-redeclare */
import { AccountModel } from '@/domain/models';

export interface LoadAccountByEmailRepository {
  loadByEmail(email: string): Promise<LoadAccountByEmailRepository.Result>;
}

export declare namespace LoadAccountByEmailRepository {
  export type Result = AccountModel;
}
