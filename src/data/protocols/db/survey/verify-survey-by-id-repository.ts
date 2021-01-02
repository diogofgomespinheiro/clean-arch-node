export interface VerifySurveyByIdRepository {
  verifyById(id: string): Promise<VerifySurveyByIdRepository.Result>;
}

// eslint-disable-next-line no-redeclare
export declare namespace VerifySurveyByIdRepository {
  export type Result = boolean;
}
