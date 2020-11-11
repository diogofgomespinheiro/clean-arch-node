import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import { Authentication } from '@/domain/useCases/account/authentication';
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { DbAuthentication } from '@/data/useCases/account/authentication/db-authentication';
import { JwtAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter';
import env from '@/main/config/env';

export const makeDbAuthentication = (): Authentication => {
  const accountMongoRepository = new AccountMongoRepository();
  const bcryptAdapter = new BcryptAdapter(env.defaultSalt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);

  return new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  );
};
