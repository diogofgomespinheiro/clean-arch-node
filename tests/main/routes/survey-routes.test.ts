import request from 'supertest';
import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import faker from 'faker';

import app from '@/main/config/app';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import env from '@/main/config/env';

const makeAccessToken = async (role?: string): Promise<string> => {
  const accountCollection = await MongoHelper.getCollection('accounts');
  const password = await hash('123456', env.defaultSalt);
  const res = await accountCollection.insertOne({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    ...(role && { role })
  });

  const id = res.ops[0]._id;
  const accessToken = sign({ id }, env.jwtSecret);
  await accountCollection.updateOne(
    {
      _id: id
    },
    {
      $set: {
        accessToken
      }
    }
  );

  return accessToken;
};

describe('Survey Routes', () => {
  describe('POST /surveys', () => {
    it('should return 403 if no accessToken is provided', async () => {
      await request(app)
        .post('/api/v1/surveys')
        .send({
          question: faker.random.words(),
          answers: [
            {
              answer: faker.random.word(),
              image: faker.image.imageUrl()
            },
            {
              answer: faker.random.word()
            }
          ]
        })
        .expect(403);
    });

    it('should return 204 on add survey with valid accessToken', async () => {
      const accessToken = await makeAccessToken('admin');

      await request(app)
        .post('/api/v1/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: faker.random.words(),
          answers: [
            {
              answer: faker.random.word(),
              image: faker.image.imageUrl()
            },
            {
              answer: faker.random.word()
            }
          ]
        })
        .expect(204);
    });
  });

  describe('GET /surveys', () => {
    it('should return 403 on load surveys if no accessToken is provided', async () => {
      await request(app).get('/api/v1/surveys').expect(403);
    });

    it('should return 204 on load surveys with valid accessToken and no surveys', async () => {
      const accessToken = await makeAccessToken();

      await request(app)
        .get('/api/v1/surveys')
        .set('x-access-token', accessToken)
        .expect(204);
    });

    it('should return 200 on load surveys with valid accessToken if there are any surveys', async () => {
      const accessToken = await makeAccessToken();
      const surveysCollection = await MongoHelper.getCollection('surveys');

      await surveysCollection.insertOne({
        question: faker.random.words(),
        answers: [
          {
            image: faker.image.imageUrl(),
            answer: faker.random.word()
          }
        ],
        date: new Date()
      });

      await request(app)
        .get('/api/v1/surveys')
        .set('x-access-token', accessToken)
        .expect(200);
    });
  });
});
