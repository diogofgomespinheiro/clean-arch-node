import { SurveyMongoRepository } from '@/infra/db';
import { VerifySurveyById } from '@/domain/useCases';
import { DbVerifySurveyById } from '@/data/useCases';

export const makeDbVerifySurveyById = (): VerifySurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbVerifySurveyById(surveyMongoRepository);
};
