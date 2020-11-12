import { throwError } from '@/domain/test/test-helper';
import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

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

describe('Bcrypt Adapter', () => {
  it('should call hash with correct values', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.hash('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', SALT);
  });

  it('should return a valid hash on hash success', async () => {
    const sut = makeSut();
    const hash = await sut.hash('any_value');
    expect(hash).toBe('hash');
  });

  it('should throw if bcrypt hash throws', async () => {
    const sut = makeSut();

    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(throwError);

    const promise = sut.hash('any_value');
    expect(promise).rejects.toThrow();
  });

  it('should call compare with correct values', async () => {
    const sut = makeSut();
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    await sut.compare('any_value', 'any_hash');
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
  });

  it('should return true when compare succeeds', async () => {
    const sut = makeSut();
    const hash = await sut.compare('any_value', 'any_hash');
    expect(hash).toBe(true);
  });

  it('should return false when compare fails', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => false);
    const hash = await sut.compare('any_value', 'any_hash');
    expect(hash).toBe(false);
  });

  it('should throw if bcrypt compare throws', async () => {
    const sut = makeSut();

    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(throwError);

    const promise = sut.compare('any_value', 'any_hash');
    expect(promise).rejects.toThrow();
  });
});
