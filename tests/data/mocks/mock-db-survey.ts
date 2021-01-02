import { SurveyModel } from '@/domain/models';
import {
  AddSurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository,
  VerifySurveyByIdRepository
} from '@/data/protocols/db';
import { mockSurveyModel, mockSurveyModels } from '@/tests/domain/mocks';

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  addSurveyParams: AddSurveyRepository.Params;

  async add(data: AddSurveyRepository.Params): Promise<void> {
    this.addSurveyParams = data;
    return null;
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  result = mockSurveyModel();
  surveyId: string;

  async loadById(id: string): Promise<LoadSurveyByIdRepository.Result> {
    this.surveyId = id;
    return this.result;
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  surveyModels = mockSurveyModels();
  accountId: string;

  async loadAll(accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId;
    return this.surveyModels;
  }
}

export class VerifySurveyByIdRepositorySpy
  implements VerifySurveyByIdRepository {
  result = true;
  surveyId: string;

  async verifyById(id: string): Promise<VerifySurveyByIdRepository.Result> {
    this.surveyId = id;
    return this.result;
  }
}
