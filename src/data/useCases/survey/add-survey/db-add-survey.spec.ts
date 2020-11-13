import { AddSurveyRepository } from './db-add-survey-protocols';
import { DbAddSurvey } from './db-add-survey';
import MockDate from 'mockdate';
import { throwError } from '@/domain/test/test-helper';
import { mockAddSurveyRepository } from '@/data/test';
import { mockAddSurveyParams } from '@/domain/test';

type SutTypes = {
  sut: DbAddSurvey;
  addSurveyRepositoryStub: AddSurveyRepository;
};

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);

  return {
    sut,
    addSurveyRepositoryStub
  };
};

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();

    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');

    const surveyData = mockAddSurveyParams();
    await sut.add(surveyData);

    expect(addSpy).toHaveBeenCalledWith(surveyData);
  });

  it('should throw if AddAccountRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    jest
      .spyOn(addSurveyRepositoryStub, 'add')
      .mockImplementationOnce(throwError);

    const promise = sut.add(mockAddSurveyParams());
    await expect(promise).rejects.toThrow();
  });
});
