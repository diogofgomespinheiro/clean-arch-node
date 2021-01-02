/* eslint-disable no-redeclare */
import { AccountModel } from '@/domain/models';

export interface LoadAccountByTokenRepository {
  loadByToken(
    token: string,
    role?: string
  ): Promise<LoadAccountByTokenRepository.Result>;
}

export declare namespace LoadAccountByTokenRepository {
  export type Result = AccountModel;
}
