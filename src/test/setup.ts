import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL);
});

afterAll(async () => {
  await MongoHelper.disconnect();
});

beforeEach(async () => {
  const collections = await MongoHelper.getAllCollections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});
