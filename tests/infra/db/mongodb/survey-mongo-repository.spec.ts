import { SurveyMongoRepository, MongoHelper } from '@/infra/db';
import {
  mockAddAccountParams,
  mockAddSurveyParams
} from '@/tests/domain/mocks';
import { Collection } from 'mongodb';
import FakeObjectId from 'bson-objectid';

let accountCollection: Collection;
let surveyCollection: Collection;
let surveyResultCollection: Collection;

const mockAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne(mockAddAccountParams());
  return res.ops[0]._id;
};

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository();
};

describe('SurveyMongoRepository', () => {
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    surveyCollection = await MongoHelper.getCollection('surveys');
    surveyResultCollection = await MongoHelper.getCollection('surveyResults');
  });

  describe('add()', () => {
    it('should add a survey on success', async () => {
      const sut = makeSut();
      const surveyData = mockAddSurveyParams();

      await sut.add(surveyData);

      const survey = await surveyCollection.findOne({
        question: surveyData.question
      });

      expect(survey).toBeTruthy();
      expect(survey).toEqual(surveyData);
    });
  });

  describe('loadAll()', () => {
    it('should load all surveys on success', async () => {
      const accountId = await mockAccountId();

      const surveysToInsert = [mockAddSurveyParams(), mockAddSurveyParams()];
      const result = await surveyCollection.insertMany(surveysToInsert);
      const survey = result.ops[0];

      await surveyResultCollection.insertOne({
        surveyId: survey._id,
        accountId: accountId,
        answer: survey.answers[0].answer,
        date: new Date()
      });

      const sut = makeSut();
      const surveys = await sut.loadAll(accountId);

      expect(surveys.length).toBe(2);
      expect(surveys[0].id).toBeTruthy();
      expect(surveys[0].question).toBe(surveysToInsert[0].question);
      expect(surveys[0].didAnswer).toBeTruthy();
      expect(surveys[1].id).toBeTruthy();
      expect(surveys[1].question).toBe(surveysToInsert[1].question);
      expect(surveys[1].didAnswer).toBeFalsy();
    });

    it('should load an empty list', async () => {
      const sut = makeSut();
      const accountId = await mockAccountId();
      const surveys = await sut.loadAll(accountId);

      expect(surveys.length).toBe(0);
    });
  });

  describe('loadById', () => {
    it('should load survey by id on success', async () => {
      const res = await surveyCollection.insertOne(mockAddSurveyParams());

      const id = res.ops[0]._id;
      const sut = makeSut();
      const survey = await sut.loadById(id);
      expect(survey).toBeTruthy();
      expect(survey.id).toBeTruthy();
    });
  });

  describe('verifyById', () => {
    it('should return true if survey exists', async () => {
      const res = await surveyCollection.insertOne(mockAddSurveyParams());

      const id = res.ops[0]._id;
      const sut = makeSut();
      const exists = await sut.verifyById(id);
      expect(exists).toBe(true);
    });

    it('should return false if survey exists', async () => {
      const sut = makeSut();
      const exists = await sut.verifyById(FakeObjectId.generate());
      expect(exists).toBe(false);
    });
  });
});
