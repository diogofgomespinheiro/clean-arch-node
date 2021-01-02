/* eslint-disable no-redeclare */
export interface VerifyAccountByEmailRepository {
  verifyByEmail(email: string): Promise<VerifyAccountByEmailRepository.Result>;
}

export declare namespace VerifyAccountByEmailRepository {
  export type Result = boolean;
}
