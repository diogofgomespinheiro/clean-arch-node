import { SurveyResultMongoRepository } from '@/infra/db';
import { SaveSurveyResult } from '@/domain/useCases';
import { DbSaveSurveyResult } from '@/data/useCases';

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository();
  return new DbSaveSurveyResult(
    surveyResultMongoRepository,
    surveyResultMongoRepository
  );
};
