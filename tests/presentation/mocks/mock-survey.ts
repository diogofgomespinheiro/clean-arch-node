import { AddSurvey, LoadSurveys, LoadSurveyById } from '@/domain/useCases';
import { SurveyModel } from '@/domain/models';
import { mockSurveyModel, mockSurveyModels } from '@/tests/domain/mocks';

export class AddSurveySpy implements AddSurvey {
  addSurveyParams: AddSurvey.Params;

  add(data: AddSurvey.Params): Promise<void> {
    this.addSurveyParams = data;
    return null;
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  surveyModels = mockSurveyModels();
  accountId: string;

  async load(accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId;
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
