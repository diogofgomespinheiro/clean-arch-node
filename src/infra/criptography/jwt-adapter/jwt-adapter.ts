import jwt from 'jsonwebtoken';
import { Encrypter } from '@/data/protocols/criptography/encrypter';
import { Decrypter } from '@/data/protocols/criptography/decrypter';

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
