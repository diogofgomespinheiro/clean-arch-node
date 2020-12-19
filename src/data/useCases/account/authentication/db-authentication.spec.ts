import { DbAuthentication } from './db-authentication';
import {
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from './db-authentication-protocols';
import { throwError } from '@/domain/test/test-helper';
import {
  EncrypterSpy,
  HashComparerSpy,
  mockLoadAccountByEmailRepository,
  mockUpdateAccessTokenRepository
} from '@/data/test';
import { mockAddAccountParams, mockAuthenticationParams } from '@/domain/test';

type SutTypes = {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashComparerSpy: HashComparerSpy;
  encrypterSpy: EncrypterSpy;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  const hashComparerSpy = new HashComparerSpy();
  const encrypterSpy = new EncrypterSpy();
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository();

  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositoryStub
  );

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerSpy,
    encrypterSpy,
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
    const { sut, hashComparerSpy } = makeSut();
    const authenticationParams = mockAddAccountParams();
    await sut.auth(authenticationParams);

    expect(hashComparerSpy.plainText).toBe(authenticationParams.password);
    expect(hashComparerSpy.digest).toBe('hashed_password');
  });

  it('should throw if HashComparer throws', async () => {
    const { sut, hashComparerSpy } = makeSut();
    jest.spyOn(hashComparerSpy, 'compare').mockImplementationOnce(throwError);

    const promise = sut.auth(mockAuthenticationParams());

    expect(promise).rejects.toThrow();
  });

  it('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerSpy } = makeSut();
    hashComparerSpy.isValid = false;
    const accessToken = await sut.auth(mockAuthenticationParams());

    expect(accessToken).toBeNull();
  });

  it('should call Encrypter with correct id', async () => {
    const { sut, encrypterSpy } = makeSut();
    await sut.auth(mockAuthenticationParams());
    expect(encrypterSpy.plainText).toBe('any_id');
  });

  it('should throw if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut();
    jest.spyOn(encrypterSpy, 'encrypt').mockImplementationOnce(throwError);

    const promise = sut.auth(mockAuthenticationParams());

    expect(promise).rejects.toThrow();
  });

  it('should return a token on success', async () => {
    const { sut, encrypterSpy } = makeSut();

    const accessToken = await sut.auth(mockAuthenticationParams());

    expect(accessToken).toBe(encrypterSpy.cipherText);
  });

  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub, encrypterSpy } = makeSut();
    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      'updateAccessToken'
    );

    await sut.auth(mockAuthenticationParams());

    expect(updateSpy).toHaveBeenCalledWith('any_id', encrypterSpy.cipherText);
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
