import { SurveyModel } from '@/domain/models';

export interface AddSurvey {
  add(data: AddSurvey.Params): Promise<void>;
}

// eslint-disable-next-line no-redeclare
export declare namespace AddSurvey {
  export type Params = Omit<SurveyModel, 'id'>;
}
