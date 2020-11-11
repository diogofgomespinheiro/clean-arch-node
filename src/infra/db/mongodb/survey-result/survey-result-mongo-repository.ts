import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository';
import { SurveyResultModel } from '@/domain/models/survey-result';
import { SaveSurveyResultParams } from '@/domain/useCases/survey-result/save-survey-result';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection(
      'surveyResults'
    );

    const { surveyId, accountId, answer, date } = data;
    const res = await surveyResultCollection.findOneAndUpdate(
      {
        surveyId,
        accountId
      },
      {
        $set: {
          answer,
          date
        }
      },
      {
        upsert: true,
        returnOriginal: false
      }
    );

    return res.value && MongoHelper.map(res.value);
  }
}
