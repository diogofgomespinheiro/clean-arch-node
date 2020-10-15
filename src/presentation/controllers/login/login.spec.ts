import { MissingParamError } from '@/presentation/errors';
import { badRequest } from '@/presentation/helpers/http-helper';
import { LoginController } from './login';

interface SutType {
  sut: LoginController;
}

const makeSut = (): SutType => {
  const sut = new LoginController();
  return { sut };
};

describe('Login Controller', () => {
  it('Should return 400 if email is not provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  it('Should return 400 if password is not provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });
});
