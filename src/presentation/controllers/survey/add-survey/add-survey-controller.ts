import { badRequest } from '@/presentation/helpers/http/http-helper';
import {
  HttpResponse,
  HttpRequest,
  Validation,
  Controller
} from './add-survey-protocols';

export class AddSurveyController implements Controller {
  constructor(private readonly validation: Validation) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body);

    if (error) {
      return badRequest(error);
    }

    return null;
  }
}
