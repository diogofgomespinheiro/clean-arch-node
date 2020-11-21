import {
  LoadSurveyResult,
  LoadSurveyResultRepository,
  SurveyResultModel,
  LoadSurveyByIdRepository
} from './db-load-survey-result-protocols';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async load(surveyId: string): Promise<SurveyResultModel> {
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(
      surveyId
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
        percent: 0
      }))
    };

    return surveyResult;
  }
}