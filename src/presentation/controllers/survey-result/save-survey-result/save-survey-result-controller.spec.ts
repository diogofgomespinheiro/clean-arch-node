import {
  HttpRequest,
  LoadSurveyById,
  SurveyModel,
  SaveSurveyResult,
  SaveSurveyResultParams,
  SurveyResultModel
} from './save-survey-result-protocols';
import { SaveSurveyResultController } from './save-survey-result-controller';
import {
  forbidden,
  ok,
  serverError
} from '@/presentation/helpers/http/http-helper';
import { InvalidParamError, ServerError } from '@/presentation/errors';
import MockDate from 'mockdate';

const makeFakeRequest = (answer = 'any_answer'): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  },
  body: {
    answer
  },
  accountId: 'any_account_id'
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

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: 'any_id',
  surveyId: 'survey_id',
  accountId: 'account_id',
  answer: 'any_answer',
  date: new Date()
});

type SutTypes = {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
  saveSurveyResultStub: SaveSurveyResult;
};

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel> {
      return makeFakeSurvey();
    }
  }

  return new LoadSurveyByIdStub();
};

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return makeFakeSurveyResult();
    }
  }

  return new SaveSurveyResultStub();
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById();
  const saveSurveyResultStub = makeSaveSurveyResult();
  const sut = new SaveSurveyResultController(
    loadSurveyByIdStub,
    saveSurveyResultStub
  );

  return { sut, loadSurveyByIdStub, saveSurveyResultStub };
};

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

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

  it('should return 500 if LoadSurveyById throws an exception', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(() => {
      const error = new Error();
      error.stack = null;
      throw error;
    });

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  it('should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest('invalid_answer'));
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')));
  });

  it('should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save');

    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: httpRequest.params.surveyId,
      accountId: httpRequest.accountId,
      answer: httpRequest.body.answer,
      date: new Date()
    });
  });

  it('should return 500 if SaveSurveyResult throws an exception', async () => {
    const { sut, saveSurveyResultStub } = makeSut();

    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(() => {
      const error = new Error();
      error.stack = null;
      throw error;
    });

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  it('should return 200 on success', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeSurveyResult()));
  });
});
