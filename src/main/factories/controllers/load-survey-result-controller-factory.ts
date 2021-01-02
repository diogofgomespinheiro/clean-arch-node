import { Controller } from '@/presentation/protocols';
import { LoadSurveyResultController } from '@/presentation/controllers';
import {
  makeLogControllerDecorator,
  makeDbLoadSurveyResult,
  makeDbVerifySurveyById
} from '@/main/factories';

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(
    makeDbVerifySurveyById(),
    makeDbLoadSurveyResult()
  );
  return makeLogControllerDecorator(controller);
};
