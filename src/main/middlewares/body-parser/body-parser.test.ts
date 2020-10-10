import request from 'supertest';
import { Request, Response } from 'express';

import app from '@/main/config/app';

describe('Body Parser Middleware', () => {
  it('Should parse body as json', async () => {
    app.post('/test_body_parser', (req: Request, res: Response) => {
      res.send(req.body);
    });

    await request(app)
      .post('/test_body_parser')
      .send({ name: 'Diogo' })
      .expect({ name: 'Diogo' });
  });
});
