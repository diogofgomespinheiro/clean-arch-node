import { NextFunction, Request, Response } from 'express';
import { Middleware } from '@/presentation/protocols';

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request = {
      accessToken: req.headers?.['x-access-token'],
      ...(req.headers || {})
    };

    const httpResponse = await middleware.handle(request);

    if (httpResponse.statusCode !== 200) {
      return res.status(httpResponse.statusCode).json(httpResponse.body);
    }

    Object.assign(req, httpResponse.body);
    next();
  };
};
