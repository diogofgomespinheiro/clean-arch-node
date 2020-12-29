import { AddSurveyParams } from '@/domain/useCases';

export interface AddSurveyRepository {
  add(data: AddSurveyParams): Promise<void>;
}
