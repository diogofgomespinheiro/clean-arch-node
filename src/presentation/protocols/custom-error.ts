export type SerializedError = {
  field?: string;
  message: string;
  name: string;
  stack?: string;
};

export abstract class CustomError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): SerializedError[];
}
