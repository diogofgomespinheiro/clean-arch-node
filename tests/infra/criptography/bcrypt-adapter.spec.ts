import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { throwError } from '@/tests/domain/mocks';
import bcrypt from 'bcrypt';
import faker from 'faker';

const SALT = 12;

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return 'hash';
  },

  async compare(): Promise<boolean> {
    return true;
  }
}));

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(SALT);
};

let plainText: string;
let hashToCompare: string;

describe('Bcrypt Adapter', () => {
  beforeEach(() => {
    plainText = faker.random.word();
    hashToCompare = faker.random.uuid();
  });

  it('should call hash with correct values', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.hash(plainText);
    expect(hashSpy).toHaveBeenCalledWith(plainText, SALT);
  });

  it('should return a valid hash on hash success', async () => {
    const sut = makeSut();
    const hash = await sut.hash(plainText);
    expect(hash).toBe('hash');
  });

  it('should throw if bcrypt hash throws', async () => {
    const sut = makeSut();

    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(throwError);

    const promise = sut.hash(plainText);
    expect(promise).rejects.toThrow();
  });

  it('should call compare with correct values', async () => {
    const sut = makeSut();
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    await sut.compare(plainText, hashToCompare);
    expect(compareSpy).toHaveBeenCalledWith(plainText, hashToCompare);
  });

  it('should return true when compare succeeds', async () => {
    const sut = makeSut();
    const hash = await sut.compare(plainText, hashToCompare);
    expect(hash).toBe(true);
  });

  it('should return false when compare fails', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => false);
    const hash = await sut.compare(plainText, hashToCompare);
    expect(hash).toBe(false);
  });

  it('should throw if bcrypt compare throws', async () => {
    const sut = makeSut();

    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(throwError);

    const promise = sut.compare(plainText, hashToCompare);
    expect(promise).rejects.toThrow();
  });
});
