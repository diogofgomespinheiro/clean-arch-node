import { HttpRequest, LoadSurveyById } from './load-survey-result-protocols';
import { LoadSurveyResultController } from './load-survey-result-controller';
import { mockLoadSurveyById } from '@/presentation/test';
import { forbidden } from '@/presentation/helpers/http/http-helper';
import { InvalidParamError } from '@/presentation/errors';

const mockRequest = (): HttpRequest => {
  return {
    params: {
      surveyId: 'any_id'
    }
  };
};

type SutTypes = {
  sut: LoadSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById();
  const sut = new LoadSurveyResultController(loadSurveyByIdStub);
  return { sut, loadSurveyByIdStub };
};

describe('LoadSurveyResult Controller', () => {
  it('should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');

    const httpRequest = mockRequest();
    await sut.handle(httpRequest);

    expect(loadByIdSpy).toHaveBeenLastCalledWith(httpRequest.params.surveyId);
  });

  it('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockImplementationOnce(async () => null);

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });
});
