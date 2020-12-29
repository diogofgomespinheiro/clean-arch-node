import { SurveyResultMongoRepository, SurveyMongoRepository } from '@/infra/db';
import { LoadSurveyResult } from '@/domain/useCases';
import { DbLoadSurveyResult } from '@/data/useCases';

export const makeDbLoadSurveyResult = (): LoadSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository();
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveyResult(
    surveyResultMongoRepository,
    surveyMongoRepository
  );
};
