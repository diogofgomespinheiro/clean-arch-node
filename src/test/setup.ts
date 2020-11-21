import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import MockDate from 'mockdate';

beforeAll(async () => {
  MockDate.set(new Date('2021/02/10'));
  await MongoHelper.connect(process.env.MONGO_URL);
});

afterAll(async () => {
  MockDate.reset();
  await MongoHelper.disconnect();
});

beforeEach(async () => {
  const collections = await MongoHelper.getAllCollections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});
