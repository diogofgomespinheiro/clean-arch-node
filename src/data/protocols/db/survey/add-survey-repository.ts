import { AddSurveyModel } from '@/domain/useCases/survey/add-survey';

export interface AddSurveyRepository {
  add(data: AddSurveyModel): Promise<void>;
}
