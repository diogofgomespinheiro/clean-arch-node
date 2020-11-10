import {
  HttpRequest,
  LoadSurveyById,
  SurveyModel
} from './save-survey-result-protocols';
import { SaveSurveyResultController } from './save-survey-result-controller';
import {
  forbidden,
  serverError
} from '@/presentation/helpers/http/http-helper';
import { InvalidParamError, ServerError } from '@/presentation/errors';

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
});

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    }
  ],
  date: new Date()
});

type SutTypes = {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
};

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel> {
      return makeFakeSurvey();
    }
  }

  return new LoadSurveyByIdStub();
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById();
  const sut = new SaveSurveyResultController(loadSurveyByIdStub);

  return { sut, loadSurveyByIdStub };
};

describe('SaveSurveyResult Controller', () => {
  it('should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');

    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(loadByIdSpy).toHaveBeenCalledWith(httpRequest.params.surveyId);
  });

  it('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockImplementationOnce(async () => null);

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  it('should return 500 if LoadSurveys throws an exception', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(() => {
      const error = new Error();
      error.stack = null;
      throw error;
    });

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });
});
