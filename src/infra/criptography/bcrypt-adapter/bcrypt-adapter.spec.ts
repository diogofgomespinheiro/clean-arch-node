import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

const SALT = 12;

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return 'hash';
  }
}));

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(SALT);
};

describe('Bcrypt Adapter', () => {
  it('should call bcrypt with correct values', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.hash('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', SALT);
  });

  it('should return a hash on success', async () => {
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
});
