import {
  AccountModel,
  AddAccount,
  AddAccountParams,
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository
} from './db-add-account-protocols';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add(data: AddAccountParams): Promise<AccountModel> {
    const existingAccount = await this.loadAccountByEmailRepository.loadByEmail(
      data.email
    );

    if (existingAccount) return null;

    const hashedPassword = await this.hasher.hash(data.password);
    const account = await this.addAccountRepository.add(
      Object.assign({}, data, { password: hashedPassword })
    );
    return account;
  }
}
