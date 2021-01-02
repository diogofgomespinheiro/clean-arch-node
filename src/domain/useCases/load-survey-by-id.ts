import { SurveyModel } from '@/domain/models';

export interface LoadSurveyById {
  loadById(id: string): Promise<LoadSurveyById.Result>;
}

// eslint-disable-next-line no-redeclare
export namespace LoadSurveyById {
  export type Result = SurveyModel;
}
