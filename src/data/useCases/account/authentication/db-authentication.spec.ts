import { DbAuthentication } from './db-authentication';
import {
  HashComparer,
  LoadAccountByEmailRepository,
  Encrypter,
  UpdateAccessTokenRepository
} from './db-authentication-protocols';
import { throwError } from '@/domain/test/test-helper';
import {
  mockEncrypter,
  mockHashComparer,
  mockLoadAccountByEmailRepository,
  mockUpdateAccessTokenRepository
} from '@/data/test';
import { mockAuthenticationParams } from '@/domain/test';

type SutTypes = {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
  encrypterStub: Encrypter;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  const hashComparerStub = mockHashComparer();
  const encrypterStub = mockEncrypter();
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository();

  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  );

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  };
};

describe('DbAuthentication Use Case', () => {
  it('should call LoadAccountByEmailRepostiory with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');

    const fakeAuthentication = mockAuthenticationParams();
    await sut.auth(fakeAuthentication);

    expect(loadSpy).toHaveBeenCalledWith(fakeAuthentication.email);
  });

  it('should throw if LoadAccountByEmailRepostiory throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockImplementationOnce(throwError);

    const promise = sut.auth(mockAuthenticationParams());

    expect(promise).rejects.toThrow();
  });

  it('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(null);

    const accessToken = await sut.auth(mockAuthenticationParams());

    expect(accessToken).toBeNull();
  });

  it('should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, 'compare');

    await sut.auth(mockAuthenticationParams());

    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password');
  });

  it('should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(throwError);

    const promise = sut.auth(mockAuthenticationParams());

    expect(promise).rejects.toThrow();
  });

  it('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockImplementationOnce(async () => false);

    const accessToken = await sut.auth(mockAuthenticationParams());

    expect(accessToken).toBeNull();
  });

  it('should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

    await sut.auth(mockAuthenticationParams());

    expect(encryptSpy).toHaveBeenCalledWith('any_id');
  });

  it('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(throwError);

    const promise = sut.auth(mockAuthenticationParams());

    expect(promise).rejects.toThrow();
  });

  it('should return a token on success', async () => {
    const { sut } = makeSut();

    const accessToken = await sut.auth(mockAuthenticationParams());

    expect(accessToken).toBe('any_token');
  });

  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      'updateAccessToken'
    );

    await sut.auth(mockAuthenticationParams());

    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token');
  });

  it('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest
      .spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
      .mockImplementationOnce(throwError);

    const promise = sut.auth(mockAuthenticationParams());

    expect(promise).rejects.toThrow();
  });
});
