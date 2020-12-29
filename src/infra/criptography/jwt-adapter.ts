import jwt from 'jsonwebtoken';
import { Encrypter, Decrypter } from '@/data/protocols';

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {}

  async encrypt(plainText: string): Promise<string> {
    const accessToken = await jwt.sign({ id: plainText }, this.secret);
    return accessToken;
  }

  async decrypt(cipherText: string): Promise<string> {
    const value: any = await jwt.verify(cipherText, this.secret);
    return value;
  }
}
