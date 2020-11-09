import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository';
import { SurveyModel } from '@/domain/models/survey';
import { AddSurveyModel } from '@/domain/useCases/survey/add-survey';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';

export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository {
  async add(surveyData: AddSurveyModel): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('surveys');
    await accountCollection.insertOne(surveyData);
  }

  async loadAll(): Promise<SurveyModel[]> {
    const accountCollection = await MongoHelper.getCollection('surveys');
    const surveys = await accountCollection.find().toArray();
    return MongoHelper.mapCollection(surveys);
  }

  async loadById(id: string): Promise<SurveyModel> {
    const accountCollection = await MongoHelper.getCollection('surveys');
    const survey = await accountCollection.findOne({ _id: id });
    return survey && MongoHelper.map(survey);
  }
}
