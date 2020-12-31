import { ok, serverError } from '@/presentation/helpers';
import { Controller, HttpResponse } from '@/presentation/protocols';
import { LogControllerDecorator } from '@/main/decorators';
import { mockAccountModel } from '@/tests/domain/mocks';
import { LogErrorRepositorySpy } from '@/tests/data/mocks';
import faker from 'faker';

class ControllerSpy implements Controller {
  httpResponse = ok(mockAccountModel());
  request: any;

  async handle(request: any): Promise<HttpResponse> {
    this.request = request;
    return this.httpResponse;
  }
}

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

    const request = faker.lorem.sentence();

    await sut.handle(request);
    expect(controllerSpy.request).toEqual(request);
  });

  it('should return the same result of the controller', async () => {
    const { sut, controllerSpy } = makeSut();

    const httpResponse = await sut.handle(faker.lorem.sentence());
    expect(httpResponse).toEqual(controllerSpy.httpResponse);
  });

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut();
    const serverError = mockServerError();
    controllerSpy.httpResponse = serverError;

    await sut.handle(faker.lorem.sentence());
    expect(logErrorRepositorySpy.stack).toBe(serverError.body[0].stack);
  });
});
