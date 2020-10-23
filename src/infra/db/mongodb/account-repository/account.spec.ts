import { AddAccountModel } from '@/domain/useCases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';
import { Collection } from 'mongodb';
import { AccountMongoRepository } from './account';

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
});

const makeAccountCollection = async (): Promise<Collection> => {
  return await MongoHelper.getCollection('accounts');
};

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

    const accountCollection = await makeAccountCollection();
    await accountCollection.insertOne(accountData);

    const account = await sut.loadByEmail(accountData.email);

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe(accountData.name);
    expect(account.email).toBe(accountData.email);
    expect(account.password).toBe(accountData.password);
  });

  it('should return null if loadByEmail fails', async () => {
    const sut = makeSut();

    const account = await sut.loadByEmail('any_email@mail.com');

    expect(account).toBeNull();
  });

  it('should update the account accessToken on updateAccesToken success', async () => {
    const sut = makeSut();

    const accountData = makeFakeAccountData();
    const accountCollection = await makeAccountCollection();

    const res = await accountCollection.insertOne(accountData);
    const fakeAccount = res.ops[0];
    expect(fakeAccount.accessToken).toBeFalsy();

    await sut.updateAccessToken(fakeAccount._id, 'any_token');

    const account = await accountCollection.findOne({ _id: fakeAccount._id });

    expect(account).toBeTruthy();
    expect(account.accessToken).toBe('any_token');
  });
});
