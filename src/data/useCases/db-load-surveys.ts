import { LoadSurveysRepository } from '@/data/protocols';
import { LoadSurveys } from '@/domain/useCases';

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurvyesRepository: LoadSurveysRepository) {}
  async load(accountId: string): Promise<LoadSurveys.Result> {
    const surveys = await this.loadSurvyesRepository.loadAll(accountId);
    return surveys;
  }
}
