/* eslint-disable no-redeclare */

export interface Authentication {
  auth(
    authenticationParams: Authentication.Params
  ): Promise<Authentication.Result>;
}

export declare namespace Authentication {
  export type Params = {
    email: string;
    password: string;
  };

  export type Result = {
    accessToken: string;
    name: string;
  };
}
