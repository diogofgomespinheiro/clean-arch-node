import { AddAccountModel } from '@/domain/useCases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account';

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
});

describe('Account Mongo Repository', () => {
  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository();
  };

  it('should return an account on add success', async () => {
    const sut = makeSut();

    const accountData = makeFakeAccountData();

    const account = await sut.add(accountData);

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe(accountData.name);
    expect(account.email).toBe(accountData.email);
    expect(account.password).toBe(accountData.password);
  });

  it('should return an account on loadByEmail success', async () => {
    const sut = makeSut();

    const accountData = makeFakeAccountData();

    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.insertOne(accountData);

    const account = await sut.loadByEmail(accountData.email);

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe(accountData.name);
    expect(account.email).toBe(accountData.email);
    expect(account.password).toBe(accountData.password);
  });
});
