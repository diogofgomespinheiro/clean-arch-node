import { HashComparer } from '@/data/protocols/crytography/hash-comparer';
import { LoadAccountByEmailRepository } from '@/data/protocols/db/load-account-by-email-repository';
import {
  Authentication,
  AuthenticationModel
} from '@/domain/useCases/authentication';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer
  ) {}

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(
      authentication.email
    );

    if (!account) {
      return null;
    }

    await this.hashComparer.compare(authentication.password, account.password);
    return null;
  }
}
