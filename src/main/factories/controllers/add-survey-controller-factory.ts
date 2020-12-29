import { AddSurveyController } from '@/presentation/controllers';
import { Controller } from '@/presentation/protocols';
import {
  makeLogControllerDecorator,
  makeDbAddSurvey,
  makeAddSurveyValidation
} from '@/main/factories';

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(
    makeAddSurveyValidation(),
    makeDbAddSurvey()
  );
  return makeLogControllerDecorator(controller);
};
