export type AuthenticationModel = {
  email: string;
  password: string;
};

export interface Authentication {
  auth(AuthenticationModel): Promise<string>;
}
