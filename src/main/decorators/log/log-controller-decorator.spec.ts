import { ok, serverError } from '@/presentation/helpers/http/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { LogControllerDecorator } from './log-controller-decorator';
import { mockAccountModel } from '@/domain/test';
import { LogErrorRepositorySpy } from '@/data/test';

const mockRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
});

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';

  const error = serverError(fakeError);
  return error;
};

type SutTypes = {
  controllerStub: Controller;
  logErrorRepositorySpy: LogErrorRepositorySpy;
  sut: LogControllerDecorator;
};

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = ok(mockAccountModel());
      return httpResponse;
    }
  }

  return new ControllerStub();
};

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const logErrorRepositorySpy = new LogErrorRepositorySpy();
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositorySpy);

  return {
    controllerStub,
    logErrorRepositorySpy,
    sut
  };
};

describe('LogController Decorator', () => {
  it('should call controller handle method', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');

    const httpRequest = mockRequest();

    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  it('should return the same result of the controller', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok(mockAccountModel()));
  });

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositorySpy } = makeSut();
    const serverError = makeFakeServerError();

    jest.spyOn(controllerStub, 'handle').mockImplementationOnce(async () => {
      return serverError;
    });

    await sut.handle(mockRequest());
    expect(logErrorRepositorySpy.stack).toBe(serverError.body[0].stack);
  });
});
