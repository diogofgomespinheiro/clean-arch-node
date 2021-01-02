import { SurveyResultModel } from '@/domain/models';
import {
  SaveSurveyResult,
  SaveSurveyResultParams,
  LoadSurveyResult
} from '@/domain/useCases';
import { mockSurveyResultModel } from '@/tests/domain/mocks';

export class SaveSurveyResultSpy implements SaveSurveyResult {
  surveyResultModel = mockSurveyResultModel();
  saveSurveyResultParams: SaveSurveyResultParams;

  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
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
