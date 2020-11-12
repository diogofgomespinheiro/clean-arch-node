import { AccountModel } from '@/domain/models/account';
import { AddAccountParams } from '@/domain/useCases/account/add-account';

export const mockAccountModel = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
});

export const mockAddAccountParams = (
  accessToken?: string,
  role?: string
): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  ...(accessToken && { accessToken }),
  ...(role && { role })
});
