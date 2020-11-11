import { Controller } from '@/presentation/protocols';
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log/log-controller-decorator-factory';
import { makeDbLoadSurveyById } from '@/main/factories/useCases/survey/load-survey-by-id/db-load-surveys-factory';
import { makeDbSaveSurveyResult } from '@/main/factories/useCases/survey-result/save-survey-result/db-save-survey-result-factory';

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeDbLoadSurveyById(),
    makeDbSaveSurveyResult()
  );
  return makeLogControllerDecorator(controller);
};
