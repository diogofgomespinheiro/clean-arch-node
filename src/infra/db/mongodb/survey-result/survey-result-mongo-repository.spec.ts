import { AddSurveyModel } from '@/domain/useCases/survey/add-survey';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { SaveSurveyResultModel } from '@/domain/useCases/survey-result/save-survey-result';
import { SurveyModel } from '@/domain/models/survey';
import { AccountModel } from '@/domain/models/account';
import { AddAccountModel } from '@/domain/useCases/account/add-account';
import { SurveyResultMongoRepository } from './survey-result-mongo-repository';
import { SurveyResultModel } from '@/domain/models/survey-result';

const makeFakeSurveyData = (question = 'any_question'): AddSurveyModel => ({
  question,
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    },
    {
      answer: 'other_answer'
    }
  ],
  date: new Date()
});

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
});

const makeFakeSurveyResultData = (
  account: AccountModel,
  survey: SurveyModel,
  answerIndex = 0
): SaveSurveyResultModel => ({
  surveyId: survey.id,
  accountId: account.id,
  answer: survey.answers[answerIndex].answer,
  date: new Date()
});

const makeSurvey = async (): Promise<SurveyModel> => {
  const surveyCollection = await MongoHelper.getCollection('surveys');
  const res = await surveyCollection.insertOne(makeFakeSurveyData());
  return MongoHelper.map(res.ops[0]);
};

const makeAccount = async (): Promise<AccountModel> => {
  const accountCollection = await MongoHelper.getCollection('accounts');
  const res = await accountCollection.insertOne(makeFakeAccountData());
  return MongoHelper.map(res.ops[0]);
};

const makeSurveyResult = async (
  data: SaveSurveyResultModel
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
        makeFakeSurveyResultData(account, survey)
      );

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.id).toBeTruthy();
      expect(surveyResult.answer).toBe(survey.answers[0].answer);
    });

    it('should update a survey result if it`s not new', async () => {
      const survey = await makeSurvey();
      const account = await makeAccount();

      const surveyResultBeforeUpdate = await makeSurveyResult(
        makeFakeSurveyResultData(account, survey)
      );
      const sut = makeSut();

      const surveyResultAfterUpdate = await sut.save(
        makeFakeSurveyResultData(account, survey, 1)
      );

      expect(surveyResultAfterUpdate).toBeTruthy();
      expect(surveyResultAfterUpdate.id).toEqual(surveyResultBeforeUpdate.id);
      expect(surveyResultAfterUpdate.answer).toBe(survey.answers[1].answer);
    });
  });
});
