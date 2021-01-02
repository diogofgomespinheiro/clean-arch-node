import { SurveyResultModel } from '@/domain/models';

export interface SaveSurveyResult {
  save(data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result>;
}

// eslint-disable-next-line no-redeclare
export declare namespace SaveSurveyResult {
  export type Params = {
    surveyId: string;
    accountId: string;
    answer: string;
    date: Date;
  };

  export type Result = SurveyResultModel;
}
