import {
  InvalidParamError,
  MissingParamError,
  ServerError,
  UnauthorizedError
} from '@/presentation/errors';
import { HttpResponse } from '@/presentation/protocols/http';

export const badRequest = (
  error: MissingParamError | InvalidParamError
): HttpResponse => ({
  statusCode: 400,
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
