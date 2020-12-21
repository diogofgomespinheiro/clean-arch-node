import {
  mockLoadSurveyByIdRepository,
  LoadSurveyResultRepositorySpy
} from '@/data/test';
import { mockEmptySurveyResultModel } from '@/domain/test';
import { throwError } from '@/domain/test/test-helper';
import faker from 'faker';
import { DbLoadSurveyResult } from './db-load-survey-result';
import { LoadSurveyByIdRepository } from './db-load-survey-result-protocols';

type SutTypes = {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy();
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyResult(
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepositoryStub
  );
  return { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositoryStub };
};

let surveyId: string;

describe('DbLoadSurveyResult use case', () => {
  beforeEach(() => {
    surveyId = faker.random.uuid();
  });

  it('should call LoadSurveyResultRepository with correct surveyId', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    await sut.load(surveyId);
    expect(loadSurveyResultRepositorySpy.surveyId).toBe(surveyId);
  });

  it('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    jest
      .spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId')
      .mockImplementationOnce(throwError);

    const promise = sut.load(surveyId);
    await expect(promise).rejects.toThrow();
  });

  it('should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const {
      sut,
      loadSurveyByIdRepositoryStub,
      loadSurveyResultRepositorySpy
    } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');
    loadSurveyResultRepositorySpy.surveyResultModel = null;

    await sut.load(surveyId);
    expect(loadByIdSpy).toHaveBeenCalledWith(surveyId);
  });

  it('should return a surveyResult with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    loadSurveyResultRepositorySpy.surveyResultModel = null;

    const surveyResult = await sut.load(surveyId);
    expect(surveyResult).toEqual(mockEmptySurveyResultModel());
  });

  it('should return a surveyResult on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();

    const surveyResult = await sut.load(surveyId);
    expect(surveyResult).toEqual(
      loadSurveyResultRepositorySpy.surveyResultModel
    );
  });
});
