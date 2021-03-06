import { ApolloServer } from 'apollo-server-express';
import { GraphQLError } from 'graphql';
import { Express } from 'express';

import typeDefs from '@/main/graphql/type-defs';
import resolvers from '@/main/graphql/resolvers';
import schemaDirectives from '@/main/graphql/directives';

const handleErrors = (response: any, errors: readonly GraphQLError[]) => {
  if (!errors?.length) return;
  errors.forEach((error, index) => {
    if (checkError(error, 'UserInputError')) {
      response.http.status = 400;
      response.data = JSON.parse(error.message);
    } else if (checkError(error, 'AuthenticationError')) {
      response.http.status = 401;
      response.data = JSON.parse(error.message);
    } else if (checkError(error, 'ForbiddenError')) {
      response.http.status = 403;
      response.data = JSON.parse(error.message);
    } else {
      response.http.status = 500;
    }
  });
};

const checkError = (error: GraphQLError, errorName: string): boolean => {
  return [error.name, error.originalError?.name].some(
    name => name === errorName
  );
};

export default (app: Express): void => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    schemaDirectives,
    context: ({ req }) => ({ req }),
    plugins: [
      {
        requestDidStart: () => ({
          willSendResponse: ({ response, errors }) =>
            handleErrors(response, errors)
        })
      }
    ]
  });
  server.applyMiddleware({ app });
};
