import {
  Decrypter,
  Encrypter,
  HashComparer,
  Hasher
} from '@/data/protocols/cryptography';
import faker from 'faker';

export class HasherSpy implements Hasher {
  digest = faker.random.uuid();
  plainText: string;

  async hash(plainText: string): Promise<string> {
    this.plainText = plainText;
    return this.digest;
  }
}
export class DecrypterSpy implements Decrypter {
  plainText = faker.internet.password();
  cipherText: string;

  async decrypt(cipherText: string): Promise<string> {
    this.cipherText = cipherText;
    return this.plainText;
  }
}

export class EncrypterSpy implements Encrypter {
  cipherText = faker.random.uuid();
  plainText: string;

  async encrypt(plainText: string): Promise<string> {
    this.plainText = plainText;
    return this.cipherText;
  }
}

export class HashComparerSpy implements HashComparer {
  plainText: string;
  digest: string;
  isValid = true;

  async compare(plainText: string, digest: string): Promise<boolean> {
    this.plainText = plainText;
    this.digest = digest;
    return this.isValid;
  }
}
