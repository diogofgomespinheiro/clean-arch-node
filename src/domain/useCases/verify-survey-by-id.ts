export interface VerifySurveyById {
  verifyById(id: string): Promise<VerifySurveyById.Result>;
}

// eslint-disable-next-line no-redeclare
export namespace VerifySurveyById {
  export type Result = boolean;
}
