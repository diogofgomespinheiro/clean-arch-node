import {
  Authentication,
  AuthenticationParams,
  HashComparer,
  LoadAccountByEmailRepository,
  Encrypter,
  UpdateAccessTokenRepository
} from './db-authentication-protocols';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth(authenticationParams: AuthenticationParams): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      authenticationParams.email
    );

    if (!account) {
      return null;
    }

    const isValid = await this.hashComparer.compare(
      authenticationParams.password,
      account.password
    );

    if (!isValid) {
      return null;
    }

    const accessToken = await this.encrypter.encrypt(account.id);
    await this.updateAccessTokenRepository.updateAccessToken(
      account.id,
      accessToken
    );

    return accessToken;
  }
}
