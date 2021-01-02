import { SurveyResultModel } from '@/domain/models';

export interface LoadSurveyResultRepository {
  loadBySurveyId(
    surveyId: string,
    accountId: string
  ): Promise<LoadSurveyResultRepository.Result>;
}

// eslint-disable-next-line no-redeclare
export namespace LoadSurveyResultRepository {
  export type Result = SurveyResultModel;
}
