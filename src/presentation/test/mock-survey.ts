import {
  AddSurvey,
  AddSurveyParams
} from '@/domain/useCases/survey/add-survey';
import { SurveyModel } from '@/domain/models/survey';
import { mockSurveyModel, mockSurveyModels } from '@/domain/test';
import { LoadSurveys } from '@/domain/useCases/survey/load-surveys';
import { LoadSurveyById } from '@/domain/useCases/survey/load-survey-by-id';

export class AddSurveySpy implements AddSurvey {
  addSurveyParams: AddSurveyParams;

  add(data: AddSurveyParams): Promise<void> {
    this.addSurveyParams = data;
    return null;
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  surveyModels = mockSurveyModels();
  callsCount = 0;

  async load(): Promise<SurveyModel[]> {
    this.callsCount++;
    return this.surveyModels;
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  surveyModel = mockSurveyModel();
  surveyId: string;

  async loadById(id: string): Promise<SurveyModel> {
    this.surveyId = id;
    return this.surveyModel;
  }
}
