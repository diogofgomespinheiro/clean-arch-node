import {
  LoadSurveyByIdRepositorySpy,
  LoadSurveyResultRepositorySpy
} from '@/data/test';
import { throwError } from '@/domain/test/test-helper';
import faker from 'faker';
import { DbLoadSurveyResult } from './db-load-survey-result';

type SutTypes = {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy;
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy();
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy();
  const sut = new DbLoadSurveyResult(
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepositorySpy
  );
  return { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy };
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
      loadSurveyByIdRepositorySpy,
      loadSurveyResultRepositorySpy
    } = makeSut();
    loadSurveyResultRepositorySpy.surveyResultModel = null;

    await sut.load(surveyId);
    expect(loadSurveyByIdRepositorySpy.surveyId).toBe(surveyId);
  });

  it('should return a surveyResult with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const {
      sut,
      loadSurveyResultRepositorySpy,
      loadSurveyByIdRepositorySpy
    } = makeSut();
    loadSurveyResultRepositorySpy.surveyResultModel = null;

    const surveyResult = await sut.load(surveyId);
    const { surveyModel } = loadSurveyByIdRepositorySpy;

    expect(surveyResult).toEqual({
      surveyId: surveyModel.id,
      question: surveyModel.question,
      date: surveyModel.date,
      answers: surveyModel.answers.map(answer =>
        Object.assign({}, answer, {
          count: 0,
          percent: 0
        })
      )
    });
  });

  it('should return a surveyResult on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();

    const surveyResult = await sut.load(surveyId);
    expect(surveyResult).toEqual(
      loadSurveyResultRepositorySpy.surveyResultModel
    );
  });
});
