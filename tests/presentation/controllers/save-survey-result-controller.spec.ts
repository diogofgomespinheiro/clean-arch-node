import { SaveSurveyResultController } from '@/presentation/controllers';
import { forbidden, ok, serverError } from '@/presentation/helpers';
import { InvalidParamError, ServerError } from '@/presentation/errors';
import { throwNullStackError } from '@/tests/domain/mocks';
import {
  LoadSurveyByIdSpy,
  SaveSurveyResultSpy
} from '@/tests/presentation/mocks';
import faker from 'faker';

const mockRequest = (
  answer: string = null
): SaveSurveyResultController.Request => ({
  surveyId: faker.random.uuid(),
  answer,
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

    const request = mockRequest();
    await sut.handle(request);
    expect(loadSurveyByIdSpy.surveyId).toBe(request.surveyId);
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

    const request = mockRequest(
      loadSurveyByIdSpy.surveyModel.answers[0].answer
    );

    await sut.handle(request);
    expect(saveSurveyResultSpy.saveSurveyResultParams).toEqual({
      ...request,
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
