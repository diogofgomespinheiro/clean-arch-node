import { ServerError, UnauthorizedError } from '@/presentation/errors';
import { HttpResponse } from '@/presentation/protocols/http';
import { CustomError } from '@/presentation/protocols';

export const badRequest = (error: CustomError): HttpResponse => ({
  statusCode: 400,
  body: error.serializeErrors()
});

export const forbidden = (error: CustomError): HttpResponse => ({
  statusCode: 403,
  body: error.serializeErrors()
});

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError().serializeErrors()
});

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack).serializeErrors()
});

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
});

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null
});
