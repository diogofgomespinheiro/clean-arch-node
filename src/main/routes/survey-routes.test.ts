import request from 'supertest';

import app from '@/main/config/app';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import env from '@/main/config/env';
import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';

const makeAccessToken = async (role?: string): Promise<string> => {
  const accountCollection = await MongoHelper.getCollection('accounts');
  const password = await hash('123456', env.defaultSalt);
  const res = await accountCollection.insertOne({
    name: 'Diogo',
    email: 'diogo@gmail.com',
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
          question: 'Question',
          answers: [
            {
              answer: 'Answer 1',
              image: 'http://image-name.com'
            },
            {
              answer: 'Answer 2'
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
          question: 'Question',
          answers: [
            {
              answer: 'Answer 1',
              image: 'http://image-name.com'
            },
            {
              answer: 'Answer 2'
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
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer'
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
