import { MongoHelper as sut } from './mongo-helper';

describe('Mongo Helper', () => {
  it('Should reconnect if mongodb is down', async () => {
    let accountsCollection = await sut.getCollection('accounts');

    expect(accountsCollection).toBeTruthy();
    await sut.disconnect();

    accountsCollection = await sut.getCollection('accounts');
    expect(accountsCollection).toBeTruthy();
  });
});
