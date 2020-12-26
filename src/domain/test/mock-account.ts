import { AccountModel } from '@/domain/models/account';
import { AddAccountParams } from '@/domain/useCases/account/add-account';
import { AuthenticationParams } from '@/domain/useCases/account/authentication';
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
): AddAccountParams => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  ...(accessToken && { accessToken }),
  ...(role && { role })
});

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password()
});
