import { SignUpController } from '@/presentation/controllers/signup/signup-controller';
import { DbAddAccount } from '@/data/useCases/add-account/db-add-account';
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import { LogMongoRepository } from '@/infra/db/mongodb/log/log-mongo-repository';
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator';
import { Controller } from '@/presentation/protocols';
import { makeSignUpValidation } from './signup-validation-factory';
import env from '@/main/config/env';

export const makeSignUpController = (): Controller => {
  const bcryptAdapter = new BcryptAdapter(env.defaultSalt);
  const accountMongoRepository = new AccountMongoRepository();
  const logMongoRepository = new LogMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);

  const signUpController = new SignUpController(
    dbAddAccount,
    makeSignUpValidation()
  );

  return new LogControllerDecorator(signUpController, logMongoRepository);
};
