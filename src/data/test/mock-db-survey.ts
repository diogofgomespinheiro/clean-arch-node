import { AddSurveyParams } from '@/domain/useCases/survey/add-survey';
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository';
import { mockSurveyModel, mockSurveyModels } from '@/domain/test';
import { SurveyModel } from '@/domain/models/survey';

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  addSurveyParams: AddSurveyParams;

  async add(data: AddSurveyParams): Promise<void> {
    this.addSurveyParams = data;
    return null;
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  surveyModel = mockSurveyModel();
  surveyId: string;

  async loadById(id: string): Promise<SurveyModel> {
    this.surveyId = id;
    return this.surveyModel;
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  surveyModels = mockSurveyModels();
  callsCount = 0;

  async loadAll(): Promise<SurveyModel[]> {
    this.callsCount++;
    return this.surveyModels;
  }
}
