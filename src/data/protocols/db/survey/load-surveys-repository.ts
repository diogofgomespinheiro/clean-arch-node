import { SurveyModel } from '@/domain/models';

export interface LoadSurveysRepository {
  loadAll(accountId: string): Promise<LoadSurveysRepository.Result>;
}

// eslint-disable-next-line no-redeclare
export declare namespace LoadSurveysRepository {
  export type Result = SurveyModel[];
}
