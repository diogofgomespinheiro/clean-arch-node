import { LogMongoRepository } from './log';
import { MongoHelper } from '../helpers/mongo-helper';

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository();
};

describe('Log Mongo Repository', () => {
  it('should create an error log on success', async () => {
    const sut = makeSut();
    const errorCollection = await MongoHelper.getCollection('errors');

    await sut.logError('any_error');

    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
  });
});
