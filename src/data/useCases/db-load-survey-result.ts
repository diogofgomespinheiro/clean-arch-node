import {
  LoadSurveyByIdRepository,
  LoadSurveyResultRepository
} from '@/data/protocols';
import { LoadSurveyResult } from '@/domain/useCases';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async load(
    surveyId: string,
    accountId: string
  ): Promise<LoadSurveyResult.Result> {
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(
      surveyId,
      accountId
    );

    if (surveyResult) return surveyResult;

    const {
      id,
      question,
      date,
      answers
    } = await this.loadSurveyByIdRepository.loadById(surveyId);
    surveyResult = {
      surveyId: id,
      question,
      date,
      answers: answers.map(answer => ({
        ...answer,
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }))
    };

    return surveyResult;
  }
}
