import { Controller } from '@/presentation/protocols';
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log/log-controller-decorator-factory';
import { makeDbLoadSurveyById } from '@/main/factories/useCases/survey/load-survey-by-id/db-load-surveys-factory';
import { makeDbLoadSurveyResult } from '@/main/factories/useCases/survey-result/load-survey-result/db-load-survey-result-factory';

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(
    makeDbLoadSurveyById(),
    makeDbLoadSurveyResult()
  );
  return makeLogControllerDecorator(controller);
};
