import { SurveyResultModel } from '@/domain/models';

export interface LoadSurveyResult {
  load(surveyId: string, accountId: string): Promise<LoadSurveyResult.Result>;
}

// eslint-disable-next-line no-redeclare
export namespace LoadSurveyResult {
  export type Result = SurveyResultModel;
}
