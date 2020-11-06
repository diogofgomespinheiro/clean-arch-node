import request from 'supertest';

import app from '@/main/config/app';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import env from '@/main/config/env';
import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';

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
      const accountCollection = await MongoHelper.getCollection('accounts');
      const password = await hash('123456', env.defaultSalt);
      const res = await accountCollection.insertOne({
        name: 'Diogo',
        email: 'diogo@gmail.com',
        password,
        role: 'admin'
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
  });
});
