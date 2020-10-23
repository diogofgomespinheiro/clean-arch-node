import jwt from 'jsonwebtoken';
import { Encrypter } from '@/data/protocols/crytography/encrypter';

export class JwtAdapter implements Encrypter {
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    await jwt.sign({ id: value }, this.secret);
    return null;
  }
}
