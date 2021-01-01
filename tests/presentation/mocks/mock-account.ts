import { AccountModel } from '@/domain/models';
import {
  AddAccount,
  Authentication,
  LoadAccountByToken
} from '@/domain/useCases';
import { mockAccountModel } from '@/tests/domain/mocks';
import faker from 'faker';

export class AddAccountSpy implements AddAccount {
  accountModel = mockAccountModel();
  addAccountParams: AddAccount.Params;

  async add(data: AddAccount.Params): Promise<AddAccount.Result> {
    this.addAccountParams = data;
    return this.accountModel;
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationParams: Authentication.Params;
  authenticationModel = {
    accessToken: faker.random.uuid(),
    name: faker.name.findName()
  };

  async auth(
    authenticationParams: Authentication.Params
  ): Promise<Authentication.Result> {
    this.authenticationParams = authenticationParams;
    return this.authenticationModel;
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accountModel = mockAccountModel();
  accessToken: string;
  role: string;

  async load(accessToken: string, role?: string): Promise<AccountModel> {
    this.accessToken = accessToken;
    this.role = role;
    return this.accountModel;
  }
}
