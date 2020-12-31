/* eslint-disable no-redeclare */
/* eslint-disable import/export */
import { AddSurvey } from '@/domain/useCases';
import { badRequest, noContent, serverError } from '@/presentation/helpers';
import { Controller, HttpResponse, Validation } from '@/presentation/protocols';

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle(request: AddSurveyController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);

      if (error) {
        return badRequest(error);
      }

      const { question, answers } = request;

      await this.addSurvey.add({
        question,
        answers,
        date: new Date()
      });

      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}

export namespace AddSurveyController {
  type Answer = {
    image?: string;
    answer: string;
  };

  export type Request = {
    question: string;
    answers: Answer[];
  };
}
