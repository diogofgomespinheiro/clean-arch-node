import {
  accountSchema,
  loginParamsSchema,
  errorSchema,
  errorsSchema
} from './schemas/';

export default {
  account: accountSchema,
  loginParams: loginParamsSchema,
  error: errorSchema,
  errors: errorsSchema
};
