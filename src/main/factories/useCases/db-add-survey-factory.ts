import { AddSurvey } from '@/domain/useCases';
import { DbAddSurvey } from '@/data/useCases';
import { SurveyMongoRepository } from '@/infra/db';

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbAddSurvey(surveyMongoRepository);
};
