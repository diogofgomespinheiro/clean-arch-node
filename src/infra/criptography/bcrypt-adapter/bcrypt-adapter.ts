import bcrypt from 'bcrypt';
import { Hasher } from '@/data/protocols/crytography/hasher';

export class BcryptAdapter implements Hasher {
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);
    return hash;
  }
}
