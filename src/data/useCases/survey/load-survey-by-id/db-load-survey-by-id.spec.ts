/* eslint-disable no-undef */
import { LoadSurveyByIdRepositorySpy } from '@/data/test';
import { throwError } from '@/domain/test/test-helper';
import { DbLoadSurveyById } from './db-load-survey-by-id';
import faker from 'faker';

type SutTypes = {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositorySpy);
  return { sut, loadSurveyByIdRepositorySpy };
};

let surveyId: string;

describe('DbLoadSurveyById', () => {
  beforeEach(() => {
    surveyId = faker.random.uuid();
  });

  it('should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    await sut.loadById(surveyId);
    expect(loadSurveyByIdRepositorySpy.surveyId).toBe(surveyId);
  });

  it('should return a survey on success', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    const survey = await sut.loadById(surveyId);
    expect(survey).toEqual(loadSurveyByIdRepositorySpy.surveyModel);
  });

  it('should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    jest
      .spyOn(loadSurveyByIdRepositorySpy, 'loadById')
      .mockImplementationOnce(throwError);

    const promise = sut.loadById(surveyId);
    await expect(promise).rejects.toThrow();
  });
});
