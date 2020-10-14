import { LogMongoRepository } from './log';
import { MongoHelper } from '../helpers/mongo-helper';

describe('Log Mongo Repository', () => {
  it('Should create an error log on success', async () => {
    const sut = new LogMongoRepository();
    const errorCollection = await MongoHelper.getCollection('errors');

    await sut.logError('any_error');

    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
  });
});
