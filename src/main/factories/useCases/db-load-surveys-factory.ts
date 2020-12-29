import { SurveyMongoRepository } from '@/infra/db';
import { LoadSurveys } from '@/domain/useCases';
import { DbLoadSurveys } from '@/data/useCases';

export const makeDbLoadSurveys = (): LoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveys(surveyMongoRepository);
};
