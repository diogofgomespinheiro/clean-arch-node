import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository';
import { SurveyModel } from '@/domain/models/survey';
import { AddSurveyModel } from '@/domain/useCases/add-survey';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';

export class SurveyMongoRepository
  implements AddSurveyRepository, LoadSurveysRepository {
  async add(surveyData: AddSurveyModel): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('surveys');
    await accountCollection.insertOne(surveyData);
  }

  async loadAll(): Promise<SurveyModel[]> {
    const accountCollection = await MongoHelper.getCollection('surveys');
    const surveys: SurveyModel[] = await accountCollection.find().toArray();
    return surveys;
  }
}
