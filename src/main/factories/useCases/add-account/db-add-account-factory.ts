import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import { AddAccount } from '@/domain/useCases/add-account';
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { DbAddAccount } from '@/data/useCases/add-account/db-add-account';
import env from '@/main/config/env';

export const makeDbAddAccount = (): AddAccount => {
  const bcryptAdapter = new BcryptAdapter(env.defaultSalt);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbAddAccount(bcryptAdapter, accountMongoRepository);
};
