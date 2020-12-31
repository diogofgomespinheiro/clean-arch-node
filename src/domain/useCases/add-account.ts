/* eslint-disable no-redeclare */
import { AccountModel } from '@/domain/models';
export interface AddAccount {
  add(data: AddAccount.Params): Promise<AddAccount.Result>;
}

export namespace AddAccount {
  export type Params = {
    name: string;
    email: string;
    password: string;
  };

  export type Result = AccountModel;
}
