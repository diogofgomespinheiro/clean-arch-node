import { Controller } from '@/presentation/protocols';
import { makeDbAuthentication } from '@/main/factories/useCases/authentication/db-authentication-factory';
import { makeDbAddAccount } from '@/main/factories/useCases/account/add-account/db-add-account-factory';
import { makeSignUpValidation } from './signup-validation-factory';
import { SignUpController } from '@/presentation/controllers/auth/signup/signup-controller';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log/log-controller-decorator-factory';

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
    makeDbAuthentication()
  );

  return makeLogControllerDecorator(controller);
};
