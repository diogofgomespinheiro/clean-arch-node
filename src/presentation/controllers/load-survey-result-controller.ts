/* eslint-disable no-redeclare */
/* eslint-disable import/export */
import { LoadSurveyResult, VerifySurveyById } from '@/domain/useCases';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden, ok, serverError } from '@/presentation/helpers';
import { Controller, HttpResponse } from '@/presentation/protocols';

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly verifySurveyById: VerifySurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle(
    request: LoadSurveyResultController.Request
  ): Promise<HttpResponse> {
    try {
      const { surveyId, accountId } = request;

      const exists = await this.verifySurveyById.verifyById(surveyId);
      if (!exists) return forbidden(new InvalidParamError('surveyId'));

      const surveyResult = await this.loadSurveyResult.load(
        surveyId,
        accountId
      );

      return ok(surveyResult);
    } catch (error) {
      return serverError(error);
    }
  }
}

export declare namespace LoadSurveyResultController {
  export type Request = {
    surveyId: string;
    accountId: string;
  };
}
