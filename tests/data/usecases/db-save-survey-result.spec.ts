import { DbSaveSurveyResult } from '@/data/useCases';
import {
  LoadSurveyResultRepositorySpy,
  SaveSurveyResultRepositorySpy
} from '@/tests/data/mocks';
import { mockSaveSurveyResultParams, throwError } from '@/tests/domain/mocks';

type SutTypes = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositorySpy: SaveSurveyResultRepositorySpy;
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy;
};

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositorySpy = new SaveSurveyResultRepositorySpy();
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy();
  const sut = new DbSaveSurveyResult(
    saveSurveyResultRepositorySpy,
    loadSurveyResultRepositorySpy
  );

  return {
    sut,
    saveSurveyResultRepositorySpy,
    loadSurveyResultRepositorySpy
  };
};

describe('DbSaveSurveyResult Usecase', () => {
  it('should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut();

    const surveyResultData = mockSaveSurveyResultParams();
    await sut.save(surveyResultData);

    expect(saveSurveyResultRepositorySpy.saveSurveyResultParams).toEqual(
      surveyResultData
    );
  });

  it('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    const surveyResultData = mockSaveSurveyResultParams();
    await sut.save(surveyResultData);
    expect(loadSurveyResultRepositorySpy.surveyId).toBe(
      surveyResultData.surveyId
    );
  });

  it('should return a survey result on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    const surveyResult = await sut.save(mockSaveSurveyResultParams());
    expect(surveyResult).toEqual(
      loadSurveyResultRepositorySpy.surveyResultModel
    );
  });

  it('should throw if SaveSurveyResultRepositoryStub throws', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut();
    jest
      .spyOn(saveSurveyResultRepositorySpy, 'save')
      .mockImplementationOnce(throwError);

    const promise = sut.save(mockSaveSurveyResultParams());
    await expect(promise).rejects.toThrow();
  });

  it('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    jest
      .spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId')
      .mockImplementationOnce(throwError);

    const promise = sut.save(mockSaveSurveyResultParams());
    await expect(promise).rejects.toThrow();
  });
});
