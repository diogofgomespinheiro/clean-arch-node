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

  it('should throw if bcrypt throws', async () => {
    const sut = makeSut();

    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => {
      throw new Error();
    });

    const promise = sut.hash('any_value');
    expect(promise).rejects.toThrow();
  });

  it('should call compare with correct values', async () => {
    const sut = makeSut();
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    await sut.compare('any_value', 'any_hash');
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
  });
});
