import { AccountMongoRepository } from './account';

describe('Account Mongo Repository', () => {
  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository();
  };

  it('Should return an account on success', async () => {
    const sut = makeSut();

    const accountData = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    };

    const account = await sut.add(accountData);

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe(accountData.name);
    expect(account.email).toBe(accountData.email);
    expect(account.password).toBe(accountData.password);
  });
});
