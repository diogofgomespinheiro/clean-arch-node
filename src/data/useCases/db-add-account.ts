import { AddAccount } from '@/domain/useCases';
import {
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository
} from '@/data/protocols';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add(data: AddAccount.Params): Promise<AddAccount.Result> {
    const existingAccount = await this.loadAccountByEmailRepository.loadByEmail(
      data.email
    );

    if (existingAccount) return null;

    const hashedPassword = await this.hasher.hash(data.password);
    const account = await this.addAccountRepository.add({
      ...data,
      password: hashedPassword
    });
    return account;
  }
}
