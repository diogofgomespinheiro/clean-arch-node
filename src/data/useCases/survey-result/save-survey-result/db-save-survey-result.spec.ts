import { DbSaveSurveyResult } from './db-save-survey-result';
import {
  SaveSurveyResultParams,
  SaveSurveyResultRepository,
  SurveyResultModel
} from './db-save-survey-result-protocols';
import MockDate from 'mockdate';

const makeFakeSurveyResultData = (): SaveSurveyResultParams => ({
  surveyId: 'survey_id',
  accountId: 'account_id',
  answer: 'any_answer',
  date: new Date()
});

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: 'any_id',
  ...makeFakeSurveyResultData()
});

type SutTypes = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
};

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return makeFakeSurveyResult();
    }
  }

  return new SaveSurveyResultRepositoryStub();
};

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository();
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);

  return {
    sut,
    saveSurveyResultRepositoryStub
  };
};

describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save');

    const surveyResultData = makeFakeSurveyResultData();
    await sut.save(surveyResultData);

    expect(saveSpy).toHaveBeenCalledWith(surveyResultData);
  });

  it('should return a survey result on success', async () => {
    const { sut } = makeSut();
    const surveyResult = await sut.save(makeFakeSurveyResultData());
    expect(surveyResult).toEqual(makeFakeSurveyResult());
  });

  it('should throw if SaveSurveyResultRepositoryStub throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    jest
      .spyOn(saveSurveyResultRepositoryStub, 'save')
      .mockImplementationOnce(async () => {
        throw new Error();
      });

    const promise = sut.save(makeFakeSurveyResultData());
    await expect(promise).rejects.toThrow();
  });
});
