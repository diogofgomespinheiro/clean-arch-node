import { AccountMongoRepository, MongoHelper } from '@/infra/db';
import { mockAddAccountParams } from '@/tests/domain/mocks';
import { Collection } from 'mongodb';
import faker from 'faker';

const makeAccountCollection = async (): Promise<Collection> => {
  return await MongoHelper.getCollection('accounts');
};

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository();
};

describe('Account Mongo Repository', () => {
  describe('add()', () => {
    it('should return an account on add success', async () => {
      const sut = makeSut();

      const addAccountParams = mockAddAccountParams();

      const account = await sut.add(addAccountParams);

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(addAccountParams.name);
      expect(account.email).toBe(addAccountParams.email);
      expect(account.password).toBe(addAccountParams.password);
    });
  });

  describe('loadByEmail()', () => {
    it('should return an account on success', async () => {
      const sut = makeSut();

      const addAccountParams = mockAddAccountParams();

      const accountCollection = await makeAccountCollection();
      await accountCollection.insertOne(addAccountParams);

      const account = await sut.loadByEmail(addAccountParams.email);

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(addAccountParams.name);
      expect(account.email).toBe(addAccountParams.email);
      expect(account.password).toBe(addAccountParams.password);
    });

    it('should return null if loadByEmail fails', async () => {
      const sut = makeSut();

      const account = await sut.loadByEmail(faker.internet.email());

      expect(account).toBeNull();
    });
  });

  describe('updateAccesToken()', () => {
    it('should update the account accessToken on success', async () => {
      const sut = makeSut();

      const addAccountParams = mockAddAccountParams();
      const accountCollection = await makeAccountCollection();

      const res = await accountCollection.insertOne(addAccountParams);
      const fakeAccount = res.ops[0];
      expect(fakeAccount.accessToken).toBeFalsy();

      const accessToken = faker.random.uuid();
      await sut.updateAccessToken(fakeAccount._id, accessToken);

      const account = await accountCollection.findOne({ _id: fakeAccount._id });

      expect(account).toBeTruthy();
      expect(account.accessToken).toBe(accessToken);
    });
  });

  describe('loadByToken()', () => {
    let accessToken: string;

    beforeEach(() => {
      accessToken = faker.random.uuid();
    });

    it('should return an account on loadByToken success without role', async () => {
      const sut = makeSut();

      const addAccountParams = mockAddAccountParams(accessToken);

      const accountCollection = await makeAccountCollection();
      await accountCollection.insertOne(addAccountParams);

      const account = await sut.loadByToken(accessToken);

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(addAccountParams.name);
      expect(account.email).toBe(addAccountParams.email);
      expect(account.password).toBe(addAccountParams.password);
    });

    it('should return an account on loadByToken success with admin role', async () => {
      const sut = makeSut();

      const addAccountParams = mockAddAccountParams(accessToken, 'admin');

      const accountCollection = await makeAccountCollection();
      await accountCollection.insertOne(addAccountParams);

      const account = await sut.loadByToken(accessToken, 'admin');

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(addAccountParams.name);
      expect(account.email).toBe(addAccountParams.email);
      expect(account.password).toBe(addAccountParams.password);
    });

    it('should return an account on loadByToken if user is admin', async () => {
      const sut = makeSut();

      const addAccountParams = mockAddAccountParams(accessToken, 'admin');

      const accountCollection = await makeAccountCollection();
      await accountCollection.insertOne(addAccountParams);

      const account = await sut.loadByToken(accessToken);

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(addAccountParams.name);
      expect(account.email).toBe(addAccountParams.email);
      expect(account.password).toBe(addAccountParams.password);
    });

    it('should return null on loadByToken with invalid role', async () => {
      const sut = makeSut();

      const addAccountParams = mockAddAccountParams(accessToken);

      const accountCollection = await makeAccountCollection();
      await accountCollection.insertOne(addAccountParams);

      const account = await sut.loadByToken(accessToken, 'admin');

      expect(account).toBeFalsy();
    });

    it('should return null if loadByToken fails', async () => {
      const sut = makeSut();

      const account = await sut.loadByToken(accessToken);

      expect(account).toBeNull();
    });
  });

  describe('verifyByEmail()', () => {
    it('should return true if email exists', async () => {
      const sut = makeSut();

      const addAccountParams = mockAddAccountParams();
      const accountCollection = await makeAccountCollection();
      await accountCollection.insertOne(addAccountParams);

      const exists = await sut.verifyByEmail(addAccountParams.email);
      expect(exists).toBe(true);
    });

    it('should return false if email doesn`t exist', async () => {
      const sut = makeSut();
      const exists = await sut.verifyByEmail(faker.internet.email());
      expect(exists).toBe(false);
    });
  });
});
