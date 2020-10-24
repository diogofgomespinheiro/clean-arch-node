import { Express, Router } from 'express';
import fg from 'fast-glob';
import path from 'path';

export default (app: Express): void => {
  const router = Router();
  const routesPath = path.join(__dirname, '..', 'routes');

  app.use('/api/v1', router);

  fg.sync(`${routesPath}/**routes.+(js|ts)`, {
    extglob: true,
    braceExpansion: true,
    unique: true
  }).map(async file => {
    (await import(file)).default(router);
  });
};
