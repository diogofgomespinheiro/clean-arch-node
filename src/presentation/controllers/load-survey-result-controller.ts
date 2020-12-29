import { LoadSurveyById, LoadSurveyResult } from '@/domain/useCases';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden, ok, serverError } from '@/presentation/helpers';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const {
        params: { surveyId }
      } = httpRequest;

      const survey = await this.loadSurveyById.loadById(surveyId);
      if (!survey) return forbidden(new InvalidParamError('surveyId'));

      const surveyResult = await this.loadSurveyResult.load(
        surveyId,
        httpRequest.accountId
      );

      return ok(surveyResult);
    } catch (error) {
      return serverError(error);
    }
  }
}
