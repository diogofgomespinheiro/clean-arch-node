import { AddAccount } from '@/domain/useCases';

export interface AddAccountRepository {
  add(data: AddAccountRepository.Params): Promise<AddAccountRepository.Result>;
}

// eslint-disable-next-line no-redeclare
export declare namespace AddAccountRepository {
  export type Params = AddAccount.Params;
  export type Result = AddAccount.Result;
}
