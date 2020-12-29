import { HttpRequest } from '@/presentation/protocols';
import { LoadSurveyResultController } from '@/presentation/controllers';
import { forbidden, ok, serverError } from '@/presentation/helpers';
import { InvalidParamError, ServerError } from '@/presentation/errors';
import {
  LoadSurveyByIdSpy,
  LoadSurveyResultSpy
} from '@/tests/presentation/mocks';
import { throwNullStackError } from '@/tests/domain/mocks';
import faker from 'faker';

const mockRequest = (): HttpRequest => {
  return {
    accountId: faker.random.uuid(),
    params: {
      surveyId: faker.random.uuid()
    }
  };
};

type SutTypes = {
  sut: LoadSurveyResultController;
  loadSurveyByIdSpy: LoadSurveyByIdSpy;
  loadSurveyResultSpy: LoadSurveyResultSpy;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy();
  const loadSurveyResultSpy = new LoadSurveyResultSpy();
  const sut = new LoadSurveyResultController(
    loadSurveyByIdSpy,
    loadSurveyResultSpy
  );
  return { sut, loadSurveyByIdSpy, loadSurveyResultSpy };
};

describe('LoadSurveyResult Controller', () => {
  it('should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut();

    const httpRequest = mockRequest();
    await sut.handle(httpRequest);

    expect(loadSurveyByIdSpy.surveyId).toBe(httpRequest.params.surveyId);
  });

  it('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut();
    loadSurveyByIdSpy.surveyModel = null;

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  it('should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut();
    jest
      .spyOn(loadSurveyByIdSpy, 'loadById')
      .mockImplementationOnce(throwNullStackError);

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  it('should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultSpy } = makeSut();

    const httpRequest = mockRequest();
    await sut.handle(httpRequest);

    expect(loadSurveyResultSpy.surveyId).toBe(httpRequest.params.surveyId);
    expect(loadSurveyResultSpy.accountId).toBe(httpRequest.accountId);
  });

  it('should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultSpy } = makeSut();
    jest
      .spyOn(loadSurveyResultSpy, 'load')
      .mockImplementationOnce(throwNullStackError);

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  it('should return 200 on success', async () => {
    const { sut, loadSurveyResultSpy } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok(loadSurveyResultSpy.surveyResultModel));
  });
});
