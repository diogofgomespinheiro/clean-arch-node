import { Controller } from '@/presentation/protocols';
import { LoadSurveysController } from '@/presentation/controllers/survey/load-surveys/load-surveys-controller';
import { makeDbLoadSurveys } from '@/main/factories/useCases/survey/load-surveys/db-load-surveys-factory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log/log-controller-decorator-factory';

export const makeLoadSurveysController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurveys());
  return makeLogControllerDecorator(controller);
};
