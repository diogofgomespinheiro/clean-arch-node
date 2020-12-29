import { MongoHelper as sut } from '@/infra/db';

describe('Mongo Helper', () => {
  it('should reconnect on getCollection if mongodb is down', async () => {
    let accountsCollection = await sut.getCollection('accounts');

    expect(accountsCollection).toBeTruthy();
    await sut.disconnect();

    accountsCollection = await sut.getCollection('accounts');
    expect(accountsCollection).toBeTruthy();
  });

  it('should reconnect on getAllCollections if mongodb is down', async () => {
    let collections = await sut.getAllCollections();

    expect(collections).toBeTruthy();
    await sut.disconnect();

    collections = await sut.getAllCollections();
    expect(collections).toBeTruthy();
  });
});
