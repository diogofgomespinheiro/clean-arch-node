/* eslint-disable no-redeclare */
import { AccountModel } from '@/domain/models';

export interface LoadAccountByToken {
  load(accessToken: string, role?: string): Promise<LoadAccountByToken.Result>;
}

export declare namespace LoadAccountByToken {
  export type Result = AccountModel;
}
