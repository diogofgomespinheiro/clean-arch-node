import {
  AddSurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository,
  VerifySurveyByIdRepository
} from '@/data/protocols';
import { MongoHelper, QueryBuilder } from '@/infra/db';
import { ObjectId } from 'mongodb';

export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository,
    VerifySurveyByIdRepository {
  async add(data: AddSurveyRepository.Params): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(data);
  }

  async loadAll(accountId: string): Promise<LoadSurveysRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const query = new QueryBuilder()
      .lookup({
        from: 'surveyResults',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'surveyResult'
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [
            {
              $size: {
                $filter: {
                  input: '$surveyResult',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.accountId', new ObjectId(accountId)]
                  }
                }
              }
            },
            1
          ]
        }
      })
      .build();

    const surveys = await surveyCollection.aggregate(query).toArray();
    return MongoHelper.mapCollection(surveys);
  }

  async loadById(id: string): Promise<LoadSurveyByIdRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) });
    return survey && MongoHelper.map(survey);
  }

  async verifyById(id: string): Promise<VerifySurveyByIdRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const survey = await surveyCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { _id: 1 } }
    );
    return survey !== null;
  }
}
