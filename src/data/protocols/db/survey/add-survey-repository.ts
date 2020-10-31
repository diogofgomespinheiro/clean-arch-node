import { AddSurveyModel } from '@/domain/useCases/add-survey';

export interface AddSurveyRepository {
  add(data: AddSurveyModel): Promise<void>;
}
