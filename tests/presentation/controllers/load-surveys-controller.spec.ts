import { LoadSurveysController } from '@/presentation/controllers';
import { noContent, ok, serverError } from '@/presentation/helpers';
import { ServerError } from '@/presentation/errors';
import { throwNullStackError } from '@/tests/domain/mocks';
import { LoadSurveysSpy } from '@/tests/presentation/mocks';
import faker from 'faker';

const mockRequest = (): LoadSurveysController.Request => ({
  accountId: faker.random.uuid()
});

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
    const request = mockRequest();

    await sut.handle(request);

    expect(loadSurveysSpy.accountId).toBe(request.accountId);
  });

  it('should return 200 on success', async () => {
    const { sut, loadSurveysSpy } = makeSut();

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok(loadSurveysSpy.surveyModels));
  });

  it('should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    loadSurveysSpy.surveyModels = [];

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(noContent());
  });

  it('should return 500 if LoadSurveys throws an exception', async () => {
    const { sut, loadSurveysSpy } = makeSut();

    jest
      .spyOn(loadSurveysSpy, 'load')
      .mockImplementationOnce(throwNullStackError);

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });
});
