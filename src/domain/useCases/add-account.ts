import { AccountModel } from '@/domain/models';
export interface AddAccount {
  add(data: AddAccount.Params): Promise<AddAccount.Result>;
}

// eslint-disable-next-line no-redeclare
export namespace AddAccount {
  export type Params = {
    name: string;
    email: string;
    password: string;
  };

  export type Result = AccountModel;
}
