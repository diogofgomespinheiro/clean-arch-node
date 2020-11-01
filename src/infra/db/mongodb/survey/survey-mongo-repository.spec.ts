import { AddSurveyModel } from '@/domain/useCases/add-survey';
import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { SurveyMongoRepository } from './survey-mongo-repository';

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    },
    {
      answer: 'other_answer'
    }
  ]
});

const makeSurveyCollection = async (): Promise<Collection> => {
  return await MongoHelper.getCollection('surveys');
};

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository();
};

describe('Survey Mongo Repository', () => {
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
