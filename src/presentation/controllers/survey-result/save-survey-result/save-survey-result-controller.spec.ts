import { HttpRequest } from './save-survey-result-protocols';
import { SaveSurveyResultController } from './save-survey-result-controller';
import {
  forbidden,
  ok,
  serverError
} from '@/presentation/helpers/http/http-helper';
import { InvalidParamError, ServerError } from '@/presentation/errors';
import { throwNullStackError } from '@/domain/test/test-helper';
import { LoadSurveyByIdSpy, SaveSurveyResultSpy } from '@/presentation/test';
import faker from 'faker';

const mockRequest = (answer: string = null): HttpRequest => ({
  params: {
    surveyId: faker.random.uuid()
  },
  body: {
    answer
  },
  accountId: faker.random.uuid()
});

type SutTypes = {
  sut: SaveSurveyResultController;
  loadSurveyByIdSpy: LoadSurveyByIdSpy;
  saveSurveyResultSpy: SaveSurveyResultSpy;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy();
  const saveSurveyResultSpy = new SaveSurveyResultSpy();
  const sut = new SaveSurveyResultController(
    loadSurveyByIdSpy,
    saveSurveyResultSpy
  );

  return { sut, loadSurveyByIdSpy, saveSurveyResultSpy };
};

describe('SaveSurveyResult Controller', () => {
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

  it('should return 500 if LoadSurveyById throws an exception', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut();

    jest
      .spyOn(loadSurveyByIdSpy, 'loadById')
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
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut();

    const httpRequest = mockRequest(
      loadSurveyByIdSpy.surveyModel.answers[0].answer
    );
    await sut.handle(httpRequest);
    expect(saveSurveyResultSpy.saveSurveyResultParams).toEqual({
      surveyId: httpRequest.params.surveyId,
      accountId: httpRequest.accountId,
      answer: httpRequest.body.answer,
      date: new Date()
    });
  });

  it('should return 500 if SaveSurveyResult throws an exception', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut();

    jest
      .spyOn(saveSurveyResultSpy, 'save')
      .mockImplementationOnce(throwNullStackError);

    const httpResponse = await sut.handle(
      mockRequest(loadSurveyByIdSpy.surveyModel.answers[0].answer)
    );
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  it('should return 200 on success', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut();

    const httpResponse = await sut.handle(
      mockRequest(loadSurveyByIdSpy.surveyModel.answers[0].answer)
    );
    expect(httpResponse).toEqual(ok(saveSurveyResultSpy.surveyResultModel));
  });
});
