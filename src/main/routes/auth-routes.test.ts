import request from 'supertest';

import app from '@/main/config/app';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { hash } from 'bcrypt';
import env from '@/main/config/env';

describe('Auth Routes', () => {
  describe('POST /signup', () => {
    it('should return an account on success', async () => {
      await request(app)
        .post('/api/v1/signup')
        .send({
          name: 'Diogo',
          email: 'diogo@gmail.com',
          password: '123456',
          passwordConfirmation: '123456'
        })
        .expect(200);
    });
  });

  describe('POST /login', () => {
    it('should return 200 on login', async () => {
      const accountCollection = await MongoHelper.getCollection('accounts');
      const password = await hash('123456', env.defaultSalt);
      await accountCollection.insertOne({
        name: 'Diogo',
        email: 'diogo@gmail.com',
        password
      });

      await request(app)
        .post('/api/v1/login')
        .send({
          email: 'diogo@gmail.com',
          password: '123456'
        })
        .expect(200);
    });
  });
});
