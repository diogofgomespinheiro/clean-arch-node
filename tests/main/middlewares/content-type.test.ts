import request from 'supertest';
import { Request, Response } from 'express';

import app from '@/main/config/app';

describe('Content Type Middleware', () => {
  it('should return default content as type json', async () => {
    app.get('/test_content_type', (req: Request, res: Response) => {
      res.send('');
    });

    await request(app).get('/test_content_type').expect('content-type', /json/);
  });

  it('should return xml content when forced', async () => {
    app.get('/test_content_type_xml', (req: Request, res: Response) => {
      res.type('xml');
      res.send('');
    });

    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/);
  });
});
