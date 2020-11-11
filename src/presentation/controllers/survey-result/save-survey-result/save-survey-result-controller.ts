import { InvalidParamError } from '@/presentation/errors';
import {
  forbidden,
  serverError
} from '@/presentation/helpers/http/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
  SaveSurveyResult
} from './save-survey-result-protocols';

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  private getAn;

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

      await this.saveSurveyResult.save({
        surveyId,
        accountId,
        answer,
        date: new Date()
      });

      return null;
    } catch (error) {
      return serverError(error);
    }
  }
}
