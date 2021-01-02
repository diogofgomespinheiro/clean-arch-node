import { DbLoadSurveyResult } from '@/data/useCases';
import { throwError } from '@/tests/domain/mocks';
import {
  LoadSurveyByIdRepositorySpy,
  LoadSurveyResultRepositorySpy
} from '@/tests/data/mocks';
import faker from 'faker';

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
let accountId: string;

describe('DbLoadSurveyResult use case', () => {
  beforeEach(() => {
    surveyId = faker.random.uuid();
    accountId = faker.random.uuid();
  });

  it('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    await sut.load(surveyId, accountId);
    expect(loadSurveyResultRepositorySpy.surveyId).toBe(surveyId);
    expect(loadSurveyResultRepositorySpy.accountId).toBe(accountId);
  });

  it('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    jest
      .spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId')
      .mockImplementationOnce(throwError);

    const promise = sut.load(surveyId, accountId);
    await expect(promise).rejects.toThrow();
  });

  it('should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const {
      sut,
      loadSurveyByIdRepositorySpy,
      loadSurveyResultRepositorySpy
    } = makeSut();
    loadSurveyResultRepositorySpy.surveyResultModel = null;

    await sut.load(surveyId, accountId);
    expect(loadSurveyByIdRepositorySpy.surveyId).toBe(surveyId);
  });

  it('should return a surveyResult with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const {
      sut,
      loadSurveyResultRepositorySpy,
      loadSurveyByIdRepositorySpy
    } = makeSut();
    loadSurveyResultRepositorySpy.surveyResultModel = null;

    const surveyResult = await sut.load(surveyId, accountId);
    const { result } = loadSurveyByIdRepositorySpy;

    expect(surveyResult).toEqual({
      surveyId: result.id,
      question: result.question,
      date: result.date,
      answers: result.answers.map(answer => ({
        ...answer,
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }))
    });
  });

  it('should return a surveyResult on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();

    const surveyResult = await sut.load(surveyId, accountId);
    expect(surveyResult).toEqual(
      loadSurveyResultRepositorySpy.surveyResultModel
    );
  });
});
