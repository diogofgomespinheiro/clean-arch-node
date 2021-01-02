/* eslint-disable no-redeclare */
export interface VerifyAccountByEmailRepository {
  verifyByEmail(email: string): Promise<VerifyAccountByEmailRepository.Result>;
}

export namespace VerifyAccountByEmailRepository {
  export type Result = boolean;
}
