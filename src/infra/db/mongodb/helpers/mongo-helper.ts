import { MongoClient, Collection } from 'mongodb';

export const MongoHelper = {
  client: null as MongoClient,

  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  },

  async disconnect(): Promise<void> {
    await this.client.close();
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  },

  getAllCollections(): Promise<Array<Collection>> {
    return this.client.db().collections();
  },

  map(collection: any): any {
    const { _id, ...collectionWithoutId } = collection;

    return Object.assign({}, collectionWithoutId, { id: _id });
  }
};
