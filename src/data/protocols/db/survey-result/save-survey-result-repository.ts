import { SaveSurveyResult } from '@/domain/useCases';

export interface SaveSurveyResultRepository {
  save(data: SaveSurveyResultRepository.Params): Promise<void>;
}

// eslint-disable-next-line no-redeclare
export declare namespace SaveSurveyResultRepository {
  export type Params = SaveSurveyResult.Params;
}
