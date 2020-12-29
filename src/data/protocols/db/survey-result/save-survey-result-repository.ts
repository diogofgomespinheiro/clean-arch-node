import { SaveSurveyResultParams } from '@/domain/useCases';

export interface SaveSurveyResultRepository {
  save(data: SaveSurveyResultParams): Promise<void>;
}
