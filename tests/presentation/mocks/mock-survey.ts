import {
  AddSurvey,
  LoadSurveys,
  LoadSurveyById,
  VerifySurveyById
} from '@/domain/useCases';
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

  async load(accountId: string): Promise<LoadSurveys.Result> {
    this.accountId = accountId;
    return this.surveyModels;
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  surveyModel = mockSurveyModel();
  surveyId: string;

  async loadById(id: string): Promise<LoadSurveyById.Result> {
    this.surveyId = id;
    return this.surveyModel;
  }
}

export class VerifySurveyByIdSpy implements VerifySurveyById {
  result = true;
  surveyId: string;

  async verifyById(id: string): Promise<VerifySurveyById.Result> {
    this.surveyId = id;
    return this.result;
  }
}
