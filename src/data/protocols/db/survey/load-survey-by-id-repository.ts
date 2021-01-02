import { SurveyModel } from '@/domain/models';

export interface LoadSurveyByIdRepository {
  loadById(id: string): Promise<LoadSurveyByIdRepository.Result>;
}

// eslint-disable-next-line no-redeclare
export namespace LoadSurveyByIdRepository {
  export type Result = SurveyModel;
}
