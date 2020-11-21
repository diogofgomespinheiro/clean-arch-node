import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById
} from './load-survey-result-protocols';

export class LoadSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const {
      params: { surveyId }
    } = httpRequest;
    await this.loadSurveyById.loadById(surveyId);
    return null;
  }
}
