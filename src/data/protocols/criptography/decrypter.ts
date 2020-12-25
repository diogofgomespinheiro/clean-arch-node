export interface Decrypter {
  decrypt(chiperText: string): Promise<string>;
}
