import { Request, Response } from 'express';
import { Controller } from '@/presentation/protocols';

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const request = {
      ...(req.body || {}),
      ...(req.params || {}),
      accountId: req.accountId
    };

    const httpResponse = await controller.handle(request);
    return res.status(httpResponse.statusCode).json(httpResponse.body);
  };
};
