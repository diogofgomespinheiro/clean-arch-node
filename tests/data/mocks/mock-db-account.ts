import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository,
  VerifyAccountByEmailRepository
} from '@/data/protocols/db';
import { mockAccountModel } from '@/tests/domain/mocks';

export class AddAccountRepositorySpy implements AddAccountRepository {
  accountModel = mockAccountModel();
  addAccountParams: AddAccountRepository.Params;

  async add(
    data: AddAccountRepository.Params
  ): Promise<AddAccountRepository.Result> {
    this.addAccountParams = data;
    return this.accountModel;
  }
}

export class LoadAccountByEmailRepositorySpy
  implements LoadAccountByEmailRepository {
  accountModel = mockAccountModel();
  email: string;

  async loadByEmail(
    email: string
  ): Promise<LoadAccountByEmailRepository.Result> {
    this.email = email;
    return this.accountModel;
  }
}

export class LoadAccountByTokenRepositorySpy
  implements LoadAccountByTokenRepository {
  accountModel = mockAccountModel();
  token: string;
  role: string;

  async loadByToken(
    token: string,
    role?: string
  ): Promise<LoadAccountByTokenRepository.Result> {
    this.token = token;
    this.role = role;
    return this.accountModel;
  }
}

export class UpdateAccessTokenRepositorySpy
  implements UpdateAccessTokenRepository {
  id: string;
  token: string;

  async updateAccessToken(id: string, token: string): Promise<void> {
    this.id = id;
    this.token = token;
  }
}

export class VerifyAccountByEmailRepositorySpy
  implements VerifyAccountByEmailRepository {
  exists = false;
  email: string;

  async verifyByEmail(
    email: string
  ): Promise<VerifyAccountByEmailRepository.Result> {
    this.email = email;
    return this.exists;
  }
}
