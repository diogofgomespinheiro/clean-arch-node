import request from 'supertest';
import { Request, Response } from 'express';

import app from '@/main/config/app';

describe('Cors Middleware', () => {
  it('should enable cors', async () => {
    app.get('/test_cors', (req: Request, res: Response) => {
      res.send();
    });

    await request(app)
      .get('/test_cors')
      .expect('access-control-allow-origin', '*');
  });
});
