import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { SaveSurveyResultParams } from '@/domain/useCases/survey-result/save-survey-result';
import { SurveyModel } from '@/domain/models/survey';
import { AccountModel } from '@/domain/models/account';
import { SurveyResultMongoRepository } from './survey-result-mongo-repository';
import { SurveyResultModel } from '@/domain/models/survey-result';
import { mockAddAccountParams, mockAddSurveyParams } from '@/domain/test';

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

const makeSurveyResult = async (
  data: SaveSurveyResultParams
): Promise<SurveyResultModel> => {
  const surveyCollection = await MongoHelper.getCollection('surveyResults');
  const res = await surveyCollection.insertOne(data);
  return MongoHelper.map(res.ops[0]);
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

      const surveyResult = await sut.save(
        mockSurveyResultParams(account, survey)
      );

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.id).toBeTruthy();
      expect(surveyResult.answer).toBe(survey.answers[0].answer);
    });

    it('should update a survey result if it`s not new', async () => {
      const survey = await makeSurvey();
      const account = await makeAccount();

      const surveyResultBeforeUpdate = await makeSurveyResult(
        mockSurveyResultParams(account, survey)
      );
      const sut = makeSut();

      const surveyResultAfterUpdate = await sut.save(
        mockSurveyResultParams(account, survey, 1)
      );

      expect(surveyResultAfterUpdate).toBeTruthy();
      expect(surveyResultAfterUpdate.id).toEqual(surveyResultBeforeUpdate.id);
      expect(surveyResultAfterUpdate.answer).toBe(survey.answers[1].answer);
    });
  });
});
