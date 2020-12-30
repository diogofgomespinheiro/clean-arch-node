import {
  accountSchema,
  addSurveyParamsSchema,
  errorSchema,
  errorsSchema,
  loginParamsSchema,
  saveSurveyParamsSchema,
  signUpParamsSchema,
  surveyAnswerSchema,
  surveyResultSchema,
  surveyResultAnswerSchema,
  surveySchema,
  surveysSchema
} from './schemas/';

export default {
  account: accountSchema,
  addSurveyParams: addSurveyParamsSchema,
  error: errorSchema,
  errors: errorsSchema,
  loginParams: loginParamsSchema,
  saveSurveyParams: saveSurveyParamsSchema,
  signUpParams: signUpParamsSchema,
  survey: surveySchema,
  surveyAnswer: surveyAnswerSchema,
  surveyResult: surveyResultSchema,
  surveyResultAnswer: surveyResultAnswerSchema,
  surveys: surveysSchema
};
