import { Controller } from '@/presentation/protocols';
import { LoginController } from '@/presentation/controllers/auth/login/login-controller';
import { makeLoginValidation } from './login-validation-factory';
import { makeDbAuthentication } from '@/main/factories/useCases/authentication/db-authentication-factory';
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory';

export const makeLoginController = (): Controller => {
  const controller = new LoginController(
    makeDbAuthentication(),
    makeLoginValidation()
  );
  return makeLogControllerDecorator(controller);
};
