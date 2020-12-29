import { Controller } from '@/presentation/protocols';
import { LoginController } from '@/presentation/controllers';
import {
  makeLogControllerDecorator,
  makeDbAuthentication,
  makeLoginValidation
} from '@/main/factories';

export const makeLoginController = (): Controller => {
  const controller = new LoginController(
    makeDbAuthentication(),
    makeLoginValidation()
  );
  return makeLogControllerDecorator(controller);
};
