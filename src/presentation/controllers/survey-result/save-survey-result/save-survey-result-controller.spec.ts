import {
  HttpRequest,
  LoadSurveyById,
  SaveSurveyResult
} from './save-survey-result-protocols';
import { SaveSurveyResultController } from './save-survey-result-controller';
import {
  forbidden,
  ok,
  serverError
} from '@/presentation/helpers/http/http-helper';
import { InvalidParamError, ServerError } from '@/presentation/errors';
import { throwNullStackError } from '@/domain/test/test-helper';
import { mockSurveyResultModel } from '@/domain/test';
import { mockLoadSurveyById, mockSaveSurveyResult } from '@/presentation/test';

const mockRequest = (answer = 'any_answer'): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  },
  body: {
    answer
  },
  accountId: 'any_account_id'
});

type SutTypes = {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
  saveSurveyResultStub: SaveSurveyResult;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById();
  const saveSurveyResultStub = mockSaveSurveyResult();
  const sut = new SaveSurveyResultController(
    loadSurveyByIdStub,
    saveSurveyResultStub
  );

  return { sut, loadSurveyByIdStub, saveSurveyResultStub };
};

describe('SaveSurveyResult Controller', () => {
  it('should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');

    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(loadByIdSpy).toHaveBeenCalledWith(httpRequest.params.surveyId);
  });

  it('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockImplementationOnce(async () => null);

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  it('should return 500 if LoadSurveyById throws an exception', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockImplementationOnce(throwNullStackError);

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  it('should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(mockRequest('invalid_answer'));
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')));
  });

  it('should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save');

    const httpRequest = mockRequest();
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

    jest
      .spyOn(saveSurveyResultStub, 'save')
      .mockImplementationOnce(throwNullStackError);

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  it('should return 200 on success', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok(mockSurveyResultModel()));
  });
});
