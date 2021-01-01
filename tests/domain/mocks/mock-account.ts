import { AccountModel } from '@/domain/models';
import { AddAccount, Authentication } from '@/domain/useCases';
import faker from 'faker';

export const mockAccountModel = (): AccountModel => ({
  id: faker.random.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
});

export const mockAddAccountParams = (
  accessToken?: string,
  role?: string
): AddAccount.Params => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  ...(accessToken && { accessToken }),
  ...(role && { role })
});

export const mockAuthenticationParams = (): Authentication.Params => ({
  email: faker.internet.email(),
  password: faker.internet.password()
});
