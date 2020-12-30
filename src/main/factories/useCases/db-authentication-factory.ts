import { Authentication } from '@/domain/useCases';
import { DbAuthentication } from '@/data/useCases';
import { BcryptAdapter, JwtAdapter } from '@/infra/cryptography';
import { AccountMongoRepository } from '@/infra/db';
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
