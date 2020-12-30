import { AddAccount } from '@/domain/useCases';
import { DbAddAccount } from '@/data/useCases';
import { AccountMongoRepository } from '@/infra/db';
import { BcryptAdapter } from '@/infra/cryptography';
import env from '@/main/config/env';

export const makeDbAddAccount = (): AddAccount => {
  const bcryptAdapter = new BcryptAdapter(env.defaultSalt);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbAddAccount(
    bcryptAdapter,
    accountMongoRepository,
    accountMongoRepository
  );
};
