import { AddSurveyParams } from '@/domain/useCases/survey/add-survey';
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository';
import { mockSurveyModel, mockSurveyModels } from '@/domain/test';
import { SurveyModel } from '@/domain/models/survey';

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(accountData: AddSurveyParams): Promise<void> {
      return null;
    }
  }
  return new AddSurveyRepositoryStub();
};

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(id: string): Promise<SurveyModel> {
      return mockSurveyModel();
    }
  }
  return new LoadSurveyByIdRepositoryStub();
};

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(): Promise<SurveyModel[]> {
      return mockSurveyModels();
    }
  }

  return new LoadSurveysRepositoryStub();
};
