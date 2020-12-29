import { LoadSurveysRepository } from '@/data/protocols';
import { SurveyModel } from '@/domain/models';
import { LoadSurveys } from '@/domain/useCases';

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurvyesRepository: LoadSurveysRepository) {}
  async load(accountId: string): Promise<SurveyModel[]> {
    const surveys = await this.loadSurvyesRepository.loadAll(accountId);
    return surveys;
  }
}
