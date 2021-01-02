import { VerifySurveyById } from '@/domain/useCases';
import { VerifySurveyByIdRepository } from '@/data/protocols';

export class DbVerifySurveyById implements VerifySurveyById {
  constructor(
    private readonly verifySurveyByIdRepository: VerifySurveyByIdRepository
  ) {}

  async verifyById(id: string): Promise<VerifySurveyById.Result> {
    return this.verifySurveyByIdRepository.verifyById(id);
  }
}
