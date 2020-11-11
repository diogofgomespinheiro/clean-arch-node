import request from 'supertest';

import app from '@/main/config/app';

describe('Survey Results Routes', () => {
  describe('PUT /surveys/:surveyId/results', () => {
    it('should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/v1/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403);
    });
  });
});
