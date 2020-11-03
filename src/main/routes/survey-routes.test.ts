import request from 'supertest';

import app from '@/main/config/app';

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
  });
});
