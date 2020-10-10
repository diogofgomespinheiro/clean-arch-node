import request from 'supertest';

import app from '@/main/config/app';

describe('SignUp Routes', () => {
  it('Should return an account on success', async () => {
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
