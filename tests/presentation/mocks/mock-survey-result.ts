import { SaveSurveyResult, LoadSurveyResult } from '@/domain/useCases';
import { mockSurveyResultModel } from '@/tests/domain/mocks';

export class SaveSurveyResultSpy implements SaveSurveyResult {
  surveyResultModel = mockSurveyResultModel();
  saveSurveyResultParams: SaveSurveyResult.Params;

  async save(data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
    this.saveSurveyResultParams = data;
    return this.surveyResultModel;
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  result = mockSurveyResultModel();
  surveyId: string;
  accountId: string;

  async load(
    surveyId: string,
    accountId: string
  ): Promise<LoadSurveyResult.Result> {
    this.surveyId = surveyId;
    this.accountId = accountId;
    return this.result;
  }
}
