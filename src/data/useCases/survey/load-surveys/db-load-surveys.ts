import {
  LoadSurveys,
  LoadSurveysRepository,
  SurveyModel
} from './db-load-surveys-protocols';

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurvyesRepository: LoadSurveysRepository) {}
  async load(accountId: string): Promise<SurveyModel[]> {
    const surveys = await this.loadSurvyesRepository.loadAll(accountId);
    return surveys;
  }
}
