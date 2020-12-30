import { DbLoadAccountByToken } from '@/data/useCases';
import { LoadAccountByToken } from '@/domain/useCases';
import { JwtAdapter } from '@/infra/cryptography';
import { AccountMongoRepository } from '@/infra/db';
import env from '@/main/config/env';

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository);
};
