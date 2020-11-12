export const throwError = (): never => {
  throw new Error();
};

export const throwNullStackError = (): never => {
  const error = new Error();
  error.stack = null;
  throw error;
};
