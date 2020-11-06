import { Router } from 'express';

import { adaptRoute } from '@/main/adapters/express/express-route-adapter';
import { makeAddSurveyController } from '@/main/factories/controllers/survey/add-survey/add-survey-controller-factory';
import { adminAuth, auth } from '@/main/middlewares/auth/auth';
import { makeLoadSurveysController } from '@/main/factories/controllers/survey/load-surveys/load-surveys-controller-factory';

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()));
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()));
};
