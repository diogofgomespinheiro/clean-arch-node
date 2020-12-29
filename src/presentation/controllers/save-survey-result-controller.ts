import { LoadSurveyById, SaveSurveyResult } from '@/domain/useCases';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden, ok, serverError } from '@/presentation/helpers';
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols';

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const {
        accountId,
        params: { surveyId },
        body: { answer }
      } = httpRequest;

      const survey = await this.loadSurveyById.loadById(surveyId);
      if (!survey) return forbidden(new InvalidParamError('surveyId'));

      if (!survey.answers.find(item => item.answer === answer)) {
        return forbidden(new InvalidParamError('answer'));
      }

      const surveyResult = await this.saveSurveyResult.save({
        surveyId,
        accountId,
        answer,
        date: new Date()
      });

      return ok(surveyResult);
    } catch (error) {
      return serverError(error);
    }
  }
}
