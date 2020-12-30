import { JwtAdapter } from '@/infra/cryptography';
import { throwError } from '@/tests/domain/mocks';
import jwt from 'jsonwebtoken';
import faker from 'faker';

const token = faker.random.uuid();
const plainText = faker.random.word();
let id: string;

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return token;
  },
  async verify(): Promise<string> {
    return plainText;
  }
}));

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret');
};

describe('Jwt Adapter', () => {
  beforeEach(() => {
    id = faker.random.uuid();
  });

  describe('Encrypter', () => {
    it('should call sign with correct values', async () => {
      const sut = makeSut();
      const signSpy = jest.spyOn(jwt, 'sign');
      await sut.encrypt(id);
      expect(signSpy).toHaveBeenCalledWith({ id: id }, 'secret');
    });

    it('should return a token on sign success', async () => {
      const sut = makeSut();
      const accessToken = await sut.encrypt(id);
      expect(accessToken).toBe(token);
    });

    it('should throw if sign throws', async () => {
      const sut = makeSut();
      jest.spyOn(jwt, 'sign').mockImplementationOnce(throwError);

      const promise = sut.encrypt(id);
      expect(promise).rejects.toThrow();
    });
  });

  describe('Decrypter', () => {
    it('should call verify with correct values', async () => {
      const sut = makeSut();
      const verifySpy = jest.spyOn(jwt, 'verify');
      await sut.decrypt(token);
      expect(verifySpy).toHaveBeenCalledWith(token, 'secret');
    });

    it('should return a value on verify success', async () => {
      const sut = makeSut();
      const value = await sut.decrypt(token);
      expect(value).toBe(plainText);
    });

    it('should throw if verify throws', async () => {
      const sut = makeSut();
      jest.spyOn(jwt, 'verify').mockImplementationOnce(throwError);

      const promise = sut.decrypt(token);
      expect(promise).rejects.toThrow();
    });
  });
});
