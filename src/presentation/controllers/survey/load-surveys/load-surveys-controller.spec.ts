import { LoadSurveysController } from './load-surveys-controller';
import {
  noContent,
  ok,
  serverError
} from '@/presentation/helpers/http/http-helper';
import { ServerError } from '@/presentation/errors';
import { throwNullStackError } from '@/domain/test/test-helper';
import { LoadSurveysSpy } from '@/presentation/test';

type SutTypes = {
  sut: LoadSurveysController;
  loadSurveysSpy: LoadSurveysSpy;
};

const makeSut = (): SutTypes => {
  const loadSurveysSpy = new LoadSurveysSpy();
  const sut = new LoadSurveysController(loadSurveysSpy);

  return { sut, loadSurveysSpy };
};

describe('LoadSurveys Controller', () => {
  it('should call LoadSurveys', async () => {
    const { sut, loadSurveysSpy } = makeSut();

    await sut.handle({});
    expect(loadSurveysSpy.callsCount).toBe(1);
  });

  it('should return 200 on success', async () => {
    const { sut, loadSurveysSpy } = makeSut();

    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(ok(loadSurveysSpy.surveyModels));
  });

  it('should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    loadSurveysSpy.surveyModels = [];

    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(noContent());
  });

  it('should return 500 if LoadSurveys throws an exception', async () => {
    const { sut, loadSurveysSpy } = makeSut();

    jest
      .spyOn(loadSurveysSpy, 'load')
      .mockImplementationOnce(throwNullStackError);

    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });
});
