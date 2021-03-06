import { MongoHelper, LogMongoRepository } from '@/infra/db';
import faker from 'faker';

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository();
};

describe('LogMongoRepository', () => {
  it('should create an error log on success', async () => {
    const sut = makeSut();
    const errorCollection = await MongoHelper.getCollection('errors');

    await sut.logError(faker.random.words());

    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
  });
});
