import { LoadSurveyById } from '@/domain/useCases';
import { LoadSurveyByIdRepository } from '@/data/protocols';

export class DbLoadSurveyById implements LoadSurveyById {
  constructor(
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async loadById(id: string): Promise<LoadSurveyById.Result> {
    return this.loadSurveyByIdRepository.loadById(id);
  }
}
