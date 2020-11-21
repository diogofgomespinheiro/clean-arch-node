import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { SaveSurveyResultParams } from '@/domain/useCases/survey-result/save-survey-result';
import { SurveyModel } from '@/domain/models/survey';
import { AccountModel } from '@/domain/models/account';
import { SurveyResultMongoRepository } from './survey-result-mongo-repository';
import { SurveyResultModel } from '@/domain/models/survey-result';
import { mockAddAccountParams, mockAddSurveyParams } from '@/domain/test';
import { ObjectId } from 'mongodb';

const mockSurveyResultParams = (
  account: AccountModel,
  survey: SurveyModel,
  answerIndex = 0
): SaveSurveyResultParams => ({
  surveyId: survey.id,
  accountId: account.id,
  answer: survey.answers[answerIndex].answer,
  date: new Date()
});

const makeSurvey = async (): Promise<SurveyModel> => {
  const surveyCollection = await MongoHelper.getCollection('surveys');
  const res = await surveyCollection.insertOne(mockAddSurveyParams());
  return MongoHelper.map(res.ops[0]);
};

const makeAccount = async (): Promise<AccountModel> => {
  const accountCollection = await MongoHelper.getCollection('accounts');
  const res = await accountCollection.insertOne(mockAddAccountParams());
  return MongoHelper.map(res.ops[0]);
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
  data: SaveSurveyResultParams
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
      const account = await makeAccount();
      const sut = makeSut();

      await sut.save(mockSurveyResultParams(account, survey));
      const surveyResults = await findSurveyResults(survey.id, account.id);
      expect(surveyResults).toBeTruthy();
    });

    it('should update a survey result if it`s not new', async () => {
      const survey = await makeSurvey();
      const account = await makeAccount();

      await makeSurveyResult(mockSurveyResultParams(account, survey));
      const sut = makeSut();

      await sut.save(mockSurveyResultParams(account, survey, 1));
      const surveyResults = await findSurveyResults(survey.id, account.id);

      expect(surveyResults).toBeTruthy();
      expect(surveyResults.length).toBe(1);
    });
  });

  describe('loadBySurveyId', () => {
    it('should load survey result', async () => {
      const survey = await makeSurvey();
      const account = await makeAccount();

      await makeSurveyResult(mockSurveyResultParams(account, survey));
      await makeSurveyResult(mockSurveyResultParams(account, survey));
      await makeSurveyResult(mockSurveyResultParams(account, survey));
      await makeSurveyResult(mockSurveyResultParams(account, survey, 1));
      const sut = makeSut();

      const surveyResult = await sut.loadBySurveyId(survey.id);

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.surveyId).toEqual(survey.id);
      expect(surveyResult.answers[0].count).toBe(3);
      expect(surveyResult.answers[0].percent).toBe(75);
      expect(surveyResult.answers[1].count).toBe(1);
      expect(surveyResult.answers[1].percent).toBe(25);
      expect(surveyResult.answers.length).toBe(survey.answers.length);
    });

    it('should return null if no surveyResult is found', async () => {
      const survey = await makeSurvey();
      const sut = makeSut();
      const surveyResult = await sut.loadBySurveyId(survey.id);
      expect(surveyResult).toBeNull();
    });
  });
});
