import { LoadSurveyResultController } from '@/presentation/controllers';
import { forbidden, ok, serverError } from '@/presentation/helpers';
import { InvalidParamError, ServerError } from '@/presentation/errors';
import {
  LoadSurveyResultSpy,
  VerifySurveyByIdSpy
} from '@/tests/presentation/mocks';
import { throwNullStackError } from '@/tests/domain/mocks';
import faker from 'faker';

const mockRequest = (): LoadSurveyResultController.Request => {
  return {
    accountId: faker.random.uuid(),
    surveyId: faker.random.uuid()
  };
};

type SutTypes = {
  sut: LoadSurveyResultController;
  verifySurveyByIdSpy: VerifySurveyByIdSpy;
  loadSurveyResultSpy: LoadSurveyResultSpy;
};

const makeSut = (): SutTypes => {
  const verifySurveyByIdSpy = new VerifySurveyByIdSpy();
  const loadSurveyResultSpy = new LoadSurveyResultSpy();
  const sut = new LoadSurveyResultController(
    verifySurveyByIdSpy,
    loadSurveyResultSpy
  );
  return { sut, verifySurveyByIdSpy, loadSurveyResultSpy };
};

describe('LoadSurveyResult Controller', () => {
  it('should call VerifySurveyById with correct values', async () => {
    const { sut, verifySurveyByIdSpy } = makeSut();

    const request = mockRequest();
    await sut.handle(request);

    expect(verifySurveyByIdSpy.surveyId).toBe(request.surveyId);
  });

  it('should return 403 if VerifySurveyById returns false', async () => {
    const { sut, verifySurveyByIdSpy } = makeSut();
    verifySurveyByIdSpy.result = false;

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  it('should return 500 if VerifySurveyById throws', async () => {
    const { sut, verifySurveyByIdSpy } = makeSut();
    jest
      .spyOn(verifySurveyByIdSpy, 'verifyById')
      .mockImplementationOnce(throwNullStackError);

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  it('should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultSpy } = makeSut();

    const request = mockRequest();
    await sut.handle(request);

    expect(loadSurveyResultSpy.surveyId).toBe(request.surveyId);
    expect(loadSurveyResultSpy.accountId).toBe(request.accountId);
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
    expect(httpResponse).toEqual(ok(loadSurveyResultSpy.result));
  });
});
