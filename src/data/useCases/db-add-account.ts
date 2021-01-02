import { AddAccount } from '@/domain/useCases';
import {
  AddAccountRepository,
  Hasher,
  VerifyAccountByEmailRepository
} from '@/data/protocols';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly verifyAccountByEmailRepository: VerifyAccountByEmailRepository
  ) {}

  async add(data: AddAccount.Params): Promise<AddAccount.Result> {
    const exists = await this.verifyAccountByEmailRepository.verifyByEmail(
      data.email
    );

    if (exists) return null;

    const hashedPassword = await this.hasher.hash(data.password);
    const account = await this.addAccountRepository.add({
      ...data,
      password: hashedPassword
    });
    return account;
  }
}
