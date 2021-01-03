import {
  UserInputError,
  AuthenticationError,
  ForbiddenError,
  ApolloError
} from 'apollo-server-express';
import { Controller } from '@/presentation/protocols';

export const adaptResolver = async (
  controller: Controller,
  args?: any
): Promise<any> => {
  const request = { ...(args || {}) };
  const httpResponse = await controller.handle(request);
  switch (httpResponse.statusCode) {
    case 200:
    case 204:
      return httpResponse.body;
    case 400:
      throw new UserInputError(JSON.stringify(httpResponse.body));
    case 401:
      throw new AuthenticationError(JSON.stringify(httpResponse.body));
    case 403:
      throw new ForbiddenError(JSON.stringify(httpResponse.body));
    default:
      throw new ApolloError(JSON.stringify(httpResponse.body));
  }
};
