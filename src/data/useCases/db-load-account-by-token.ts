import { LoadAccountByToken } from '@/domain/useCases';
import { LoadAccountByTokenRepository, Decrypter } from '@/data/protocols';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load(
    accessToken: string,
    role?: string
  ): Promise<LoadAccountByToken.Result> {
    let token: string;
    try {
      token = await this.decrypter.decrypt(accessToken);
    } catch (err) {
      return null;
    }

    if (!token) return null;
    const account = await this.loadAccountByTokenRepository.loadByToken(
      accessToken,
      role
    );

    return account;
  }
}
