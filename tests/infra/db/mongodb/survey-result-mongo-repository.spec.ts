import { SaveSurveyResultRepository } from '@/data/protocols';
import { SurveyModel, SurveyResultModel } from '@/domain/models';
import { SurveyResultMongoRepository, MongoHelper } from '@/infra/db';
import {
  mockAddAccountParams,
  mockAddSurveyParams
} from '@/tests/domain/mocks';
import { ObjectId } from 'mongodb';

const mockSurveyResultParams = (
  accountId: string,
  survey: SurveyModel,
  answerIndex = 0
): SaveSurveyResultRepository.Params => ({
  surveyId: survey.id,
  accountId,
  answer: survey.answers[answerIndex].answer,
  date: new Date()
});

const makeSurvey = async (): Promise<SurveyModel> => {
  const surveyCollection = await MongoHelper.getCollection('surveys');
  const res = await surveyCollection.insertOne(mockAddSurveyParams());
  return MongoHelper.map(res.ops[0]);
};

const mockAccountId = async (): Promise<string> => {
  const accountCollection = await MongoHelper.getCollection('accounts');
  const res = await accountCollection.insertOne(mockAddAccountParams());
  return res.ops[0]._id;
};

const findSurveyResults = async (
  surveyId: string,
  accountId: string
): Promise<SurveyResultModel[]> => {
  const surveyResultCollection = await MongoHelper.getCollection(
    'surveyResults'
  );
  const surveyResults = await surveyResultCollection
    .find({
      surveyId,
      accountId
    })
    .toArray();

  return surveyResults;
};

const makeSurveyResult = async (
  data: SaveSurveyResultRepository.Params
): Promise<void> => {
  const surveyResultCollection = await MongoHelper.getCollection(
    'surveyResults'
  );
  await surveyResultCollection.insertOne({
    ...data,
    surveyId: new ObjectId(data.surveyId),
    accountId: new ObjectId(data.accountId)
  });
};

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository();
};

describe('Survey Result Mongo Repository', () => {
  describe('save()', () => {
    it('should add a survey result if it`s new', async () => {
      const survey = await makeSurvey();
      const accountId = await mockAccountId();
      const sut = makeSut();

      await sut.save(mockSurveyResultParams(accountId, survey));
      const surveyResults = await findSurveyResults(survey.id, accountId);
      expect(surveyResults).toBeTruthy();
    });

    it('should update a survey result if it`s not new', async () => {
      const survey = await makeSurvey();
      const accountId = await mockAccountId();

      await makeSurveyResult(mockSurveyResultParams(accountId, survey));
      const sut = makeSut();

      await sut.save(mockSurveyResultParams(accountId, survey, 1));
      const surveyResults = await findSurveyResults(survey.id, accountId);

      expect(surveyResults).toBeTruthy();
      expect(surveyResults.length).toBe(1);
    });
  });

  describe('loadBySurveyId', () => {
    it('should load survey result', async () => {
      const survey = await makeSurvey();
      const accountId = await mockAccountId();
      const accountId2 = await mockAccountId();

      await makeSurveyResult(mockSurveyResultParams(accountId, survey));
      await makeSurveyResult(mockSurveyResultParams(accountId2, survey));
      const sut = makeSut();

      const surveyResult = await sut.loadBySurveyId(survey.id, accountId);

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.surveyId).toEqual(survey.id);
      expect(surveyResult.answers[0].count).toBe(2);
      expect(surveyResult.answers[0].percent).toBe(100);
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBeTruthy();
      expect(surveyResult.answers[1].count).toBe(0);
      expect(surveyResult.answers[1].percent).toBe(0);
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBeFalsy();
    });

    it('should load survey result v2', async () => {
      const survey = await makeSurvey();
      const accountId = await mockAccountId();
      const accountId2 = await mockAccountId();
      const accountId3 = await mockAccountId();

      await makeSurveyResult(mockSurveyResultParams(accountId, survey));
      await makeSurveyResult(mockSurveyResultParams(accountId2, survey, 1));
      await makeSurveyResult(mockSurveyResultParams(accountId3, survey, 1));
      const sut = makeSut();

      const surveyResult = await sut.loadBySurveyId(survey.id, accountId2);

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.surveyId).toEqual(survey.id);
      expect(surveyResult.answers[0].count).toBe(2);
      expect(surveyResult.answers[0].percent).toBe(67);
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBeTruthy();
      expect(surveyResult.answers[1].count).toBe(1);
      expect(surveyResult.answers[1].percent).toBe(33);
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBeFalsy();
    });

    it('should load survey result v3', async () => {
      const survey = await makeSurvey();
      const accountId = await mockAccountId();
      const accountId2 = await mockAccountId();
      const accountId3 = await mockAccountId();

      await makeSurveyResult(mockSurveyResultParams(accountId, survey));
      await makeSurveyResult(mockSurveyResultParams(accountId3, survey, 1));
      const sut = makeSut();

      const surveyResult = await sut.loadBySurveyId(survey.id, accountId2);

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.surveyId).toEqual(survey.id);
      expect(surveyResult.answers[0].count).toBe(1);
      expect(surveyResult.answers[0].percent).toBe(50);
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBeFalsy();
      expect(surveyResult.answers[1].count).toBe(1);
      expect(surveyResult.answers[1].percent).toBe(50);
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBeFalsy();
    });

    it('should return null if no surveyResult is found', async () => {
      const survey = await makeSurvey();
      const accountId = await mockAccountId();

      const sut = makeSut();
      const surveyResult = await sut.loadBySurveyId(survey.id, accountId);
      expect(surveyResult).toBeNull();
    });
  });
});
