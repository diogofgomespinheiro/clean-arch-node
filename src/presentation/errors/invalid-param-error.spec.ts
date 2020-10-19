import { InvalidParamError } from './invalid-param-error';

describe('Invalid Param Error', () => {
  it('should serialize errors with correct structure', () => {
    const errors = new InvalidParamError('field').serializeErrors();

    const fakeErrorResponse = {
      field: 'field',
      message: 'Invalid param: field',
      name: 'InvalidParamError'
    };

    expect(errors[0]).toEqual(fakeErrorResponse);
  });
});
