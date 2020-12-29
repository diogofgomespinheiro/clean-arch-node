import { SurveyMongoRepository } from '@/infra/db';
import { LoadSurveyById } from '@/domain/useCases';
import { DbLoadSurveyById } from '@/data/useCases';

export const makeDbLoadSurveyById = (): LoadSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveyById(surveyMongoRepository);
};
