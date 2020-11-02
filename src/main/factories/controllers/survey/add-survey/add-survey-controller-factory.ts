import { AddSurveyController } from '@/presentation/controllers/survey/add-survey/add-survey-controller';
import { Controller } from '@/presentation/protocols';
import { makeAddSurveyValidation } from './add-survey-validation-factory';
import { makeDbAddSurvey } from '@/main/factories/useCases/survey/add-survey/db-add-survey-factory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log/log-controller-decorator-factory';

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(
    makeAddSurveyValidation(),
    makeDbAddSurvey()
  );
  return makeLogControllerDecorator(controller);
};
