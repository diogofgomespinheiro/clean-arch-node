import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { Controller } from '@/presentation/protocols';
import { DbAuthentication } from '@/data/useCases/authentication/db-authentication';
import { JwtAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter';
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator';
import { LoginController } from '@/presentation/controllers/login/login-controller';
import { LogMongoRepository } from '@/infra/db/mongodb/log/log-mongo-repository';
import { makeLoginValidation } from './login-validation-factory';
import env from '@/main/config/env';

export const makeLoginController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository();
  const bcryptAdapter = new BcryptAdapter(env.defaultSalt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);

  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  );

  const loginController = new LoginController(
    dbAuthentication,
    makeLoginValidation()
  );

  const logMongoRepository = new LogMongoRepository();

  return new LogControllerDecorator(loginController, logMongoRepository);
};
