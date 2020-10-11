import { ServerError } from '@/presentation/errors';
import { HttpResponse } from '@/presentation/protocols/http';
import { CustomError } from '@/presentation/protocols/custom-error';

export const badRequest = (error: CustomError): HttpResponse => ({
  statusCode: 400,
  body: error.serializeErrors()
});

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError().serializeErrors()
});

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
});
