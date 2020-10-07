import { AccountModel } from '@/domain/models/account';
import { AddAccount, AddAccountModel } from '@/domain/useCases/add-account';
import { Encrypter } from '@/data/protocols/encrypter';

export class DbAddAccount implements AddAccount {
  private readonly encrypter;

  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter;
  }

  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);
    return await null;
  }
}