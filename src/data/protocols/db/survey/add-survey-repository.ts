import { AddSurvey } from '@/domain/useCases';

export interface AddSurveyRepository {
  add(data: AddSurveyRepository.Params): Promise<void>;
}

// eslint-disable-next-line no-redeclare
export declare namespace AddSurveyRepository {
  export type Params = AddSurvey.Params;
}
