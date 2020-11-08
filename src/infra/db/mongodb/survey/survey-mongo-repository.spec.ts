import { AddSurveyModel } from '@/domain/useCases/add-survey';
import { Collection } from 'mongodb';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { SurveyMongoRepository } from './survey-mongo-repository';

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

const makeSurveyCollection = async (): Promise<Collection> => {
  return await MongoHelper.getCollection('surveys');
};

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository();
};

describe('Survey Mongo Repository', () => {
  describe('add()', () => {
    it('should add a survey on success', async () => {
      const sut = makeSut();
      const surveyData = makeFakeSurveyData();

      await sut.add(surveyData);

      const surveyCollection = await makeSurveyCollection();
      const survey = await surveyCollection.findOne({
        question: surveyData.question
      });

      expect(survey).toBeTruthy();
      expect(survey).toEqual(surveyData);
    });
  });

  describe('loadAll()', () => {
    it('should load all surveys on success', async () => {
      const surveyCollection = await makeSurveyCollection();
      const surveysToInsert = [
        makeFakeSurveyData(),
        makeFakeSurveyData('other_question')
      ];
      await surveyCollection.insertMany(surveysToInsert);

      const sut = makeSut();
      const surveys = await sut.loadAll();

      expect(surveys.length).toBe(2);
      expect(surveys[0].question).toBe(surveysToInsert[0].question);
      expect(surveys[1].question).toBe(surveysToInsert[1].question);
    });

    it('should load an empty list', async () => {
      const sut = makeSut();
      const surveys = await sut.loadAll();

      expect(surveys.length).toBe(0);
    });
  });

  describe('loadById', () => {
    it('should load survey by id on success', async () => {
      const surveyCollection = await makeSurveyCollection();
      const res = await surveyCollection.insertOne(makeFakeSurveyData());

      const id = res.ops[0]._id;
      const sut = makeSut();
      const survey = await sut.loadById(id);
      expect(survey).toBeTruthy();
    });
  });
});
