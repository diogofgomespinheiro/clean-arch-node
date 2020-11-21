import {
  mockLoadSurveyByIdRepository,
  mockLoadSurveyResultRepository
} from '@/data/test';
import {
  mockSurveyResultModel,
  mockEmptySurveyResultModel
} from '@/domain/test';
import { throwError } from '@/domain/test/test-helper';
import { DbLoadSurveyResult } from './db-load-survey-result';
import {
  LoadSurveyResultRepository,
  LoadSurveyByIdRepository
} from './db-load-survey-result-protocols';

type SutTypes = {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyResult(
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
  );
  return { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub };
};

describe('DbLoadSurveyResult use case', () => {
  it('should call LoadSurveyResultRepository with correct surveyId', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    const loadBySurveyIdSpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      'loadBySurveyId'
    );

    await sut.load('any_survey_id');
    expect(loadBySurveyIdSpy).toHaveBeenLastCalledWith('any_survey_id');
  });

  it('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockImplementationOnce(throwError);

    const promise = sut.load('any_survey_id');
    await expect(promise).rejects.toThrow();
  });

  it('should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const {
      sut,
      loadSurveyByIdRepositoryStub,
      loadSurveyResultRepositoryStub
    } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockImplementationOnce(async () => null);

    await sut.load('any_survey_id');
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id');
  });

  it('should return a surveyResult with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockImplementationOnce(async () => null);

    const surveyResult = await sut.load('any_survey_id');
    expect(surveyResult).toEqual(mockEmptySurveyResultModel());
  });

  it('should return a surveyResult on success', async () => {
    const { sut } = makeSut();

    const surveyResult = await sut.load('any_survey_id');
    expect(surveyResult).toEqual(mockSurveyResultModel());
  });
});
