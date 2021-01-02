import { SurveyModel } from '@/domain/models';

export interface LoadSurveys {
  load(accountId: string): Promise<LoadSurveys.Result>;
}

// eslint-disable-next-line no-redeclare
export declare namespace LoadSurveys {
  export type Result = SurveyModel[];
}
