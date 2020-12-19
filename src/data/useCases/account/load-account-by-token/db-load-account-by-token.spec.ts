import { DbLoadAccountByToken } from './db-load-account-by-token';
import { mockAccountModel } from '@/domain/test';
import { LoadAccountByTokenRepository } from './db-load-account-by-token-protocols';
import { throwError } from '@/domain/test/test-helper';
import { DecrypterSpy, mockLoadAccountByTokenRepository } from '@/data/test';

type SutTypes = {
  sut: DbLoadAccountByToken;
  decrypterSpy: DecrypterSpy;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
};

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy();
  const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository();

  const sut = new DbLoadAccountByToken(
    decrypterSpy,
    loadAccountByTokenRepositoryStub
  );

  return { sut, decrypterSpy, loadAccountByTokenRepositoryStub };
};

describe('DbLoadAccountByToken Usecase', () => {
  it('should call Decrypter with correct chiperText', async () => {
    const { sut, decrypterSpy } = makeSut();
    await sut.load('any_token', 'any_role');
    expect(decrypterSpy.cipherText).toBe('any_token');
  });

  it('should return null if Decrypter returns null', async () => {
    const { sut, decrypterSpy } = makeSut();
    decrypterSpy.plainText = null;
    const account = await sut.load('any_token', 'any_role');
    expect(account).toBeNull();
  });

  it('should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken');
    await sut.load('any_token', 'any_role');
    expect(loadSpy).toHaveBeenCalledWith('any_token', 'any_role');
  });

  it('should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockImplementationOnce(async () => null);
    const account = await sut.load('any_token', 'any_role');
    expect(account).toBeNull();
  });

  it('should return an account on success', async () => {
    const { sut } = makeSut();
    const account = await sut.load('any_token', 'any_role');
    expect(account).toEqual(mockAccountModel());
  });

  it('should throw if Decrypter throws', async () => {
    const { sut, decrypterSpy } = makeSut();
    jest.spyOn(decrypterSpy, 'decrypt').mockImplementationOnce(throwError);

    const promise = sut.load('any_token', 'any_role');
    await expect(promise).rejects.toThrow();
  });

  it('should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockImplementationOnce(throwError);

    const promise = sut.load('any_token', 'any_role');
    await expect(promise).rejects.toThrow();
  });
});
