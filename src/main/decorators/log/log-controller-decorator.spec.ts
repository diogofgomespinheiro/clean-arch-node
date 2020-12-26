import { ok, serverError } from '@/presentation/helpers/http/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';
import { LogControllerDecorator } from './log-controller-decorator';
import { mockAccountModel } from '@/domain/test';
import { LogErrorRepositorySpy } from '@/data/test';
import faker from 'faker';

class ControllerSpy implements Controller {
  httpResponse = ok(mockAccountModel());
  httpRequest: HttpRequest;

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    this.httpRequest = httpRequest;
    return this.httpResponse;
  }
}

const mockRequest = (): HttpRequest => {
  const password = faker.internet.password();
  return {
    body: {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
      passwordConfirmation: password
    }
  };
};

const mockServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = faker.random.word();

  const error = serverError(fakeError);
  return error;
};

type SutTypes = {
  controllerSpy: ControllerSpy;
  logErrorRepositorySpy: LogErrorRepositorySpy;
  sut: LogControllerDecorator;
};

const makeSut = (): SutTypes => {
  const controllerSpy = new ControllerSpy();
  const logErrorRepositorySpy = new LogErrorRepositorySpy();
  const sut = new LogControllerDecorator(controllerSpy, logErrorRepositorySpy);

  return {
    controllerSpy,
    logErrorRepositorySpy,
    sut
  };
};

describe('LogController Decorator', () => {
  it('should call controller handle method', async () => {
    const { sut, controllerSpy } = makeSut();

    const httpRequest = mockRequest();

    await sut.handle(httpRequest);
    expect(controllerSpy.httpRequest).toEqual(httpRequest);
  });

  it('should return the same result of the controller', async () => {
    const { sut, controllerSpy } = makeSut();

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(controllerSpy.httpResponse);
  });

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut();
    const serverError = mockServerError();
    controllerSpy.httpResponse = serverError;

    await sut.handle(mockRequest());
    expect(logErrorRepositorySpy.stack).toBe(serverError.body[0].stack);
  });
});
