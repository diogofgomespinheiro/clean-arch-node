import { DbAuthentication } from '@/data/useCases';
import {
  mockAddAccountParams,
  mockAuthenticationParams,
  throwError
} from '@/tests/domain/mocks';
import {
  EncrypterSpy,
  HashComparerSpy,
  LoadAccountByEmailRepositorySpy,
  UpdateAccessTokenRepositorySpy
} from '@/tests/data/mocks';

type SutTypes = {
  sut: DbAuthentication;
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy;
  hashComparerSpy: HashComparerSpy;
  encrypterSpy: EncrypterSpy;
  updateAccessTokenRepositorySpy: UpdateAccessTokenRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy();
  const hashComparerSpy = new HashComparerSpy();
  const encrypterSpy = new EncrypterSpy();
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy();

  const sut = new DbAuthentication(
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  );

  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  };
};

describe('DbAuthentication Use Case', () => {
  it('should call LoadAccountByEmailRepostiory with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();

    const fakeAuthentication = mockAuthenticationParams();
    await sut.auth(fakeAuthentication);

    expect(loadAccountByEmailRepositorySpy.email).toBe(
      fakeAuthentication.email
    );
  });

  it('should throw if LoadAccountByEmailRepostiory throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail')
      .mockImplementationOnce(throwError);

    const promise = sut.auth(mockAuthenticationParams());

    expect(promise).rejects.toThrow();
  });

  it('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    loadAccountByEmailRepositorySpy.accountModel = null;

    const model = await sut.auth(mockAuthenticationParams());
    expect(model).toBeNull();
  });

  it('should call HashComparer with correct values', async () => {
    const { sut, hashComparerSpy, loadAccountByEmailRepositorySpy } = makeSut();
    const authenticationParams = mockAddAccountParams();
    await sut.auth(authenticationParams);

    expect(hashComparerSpy.plainText).toBe(authenticationParams.password);
    expect(hashComparerSpy.digest).toBe(
      loadAccountByEmailRepositorySpy.accountModel.password
    );
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
    const model = await sut.auth(mockAuthenticationParams());

    expect(model).toBeNull();
  });

  it('should call Encrypter with correct id', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut();
    await sut.auth(mockAuthenticationParams());
    expect(encrypterSpy.plainText).toBe(
      loadAccountByEmailRepositorySpy.accountModel.id
    );
  });

  it('should throw if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut();
    jest.spyOn(encrypterSpy, 'encrypt').mockImplementationOnce(throwError);

    const promise = sut.auth(mockAuthenticationParams());

    expect(promise).rejects.toThrow();
  });

  it('should return an AuthenticationModel on success', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut();

    const { accessToken, name } = await sut.auth(mockAuthenticationParams());

    expect(accessToken).toBe(encrypterSpy.cipherText);
    expect(name).toBe(loadAccountByEmailRepositorySpy.accountModel.name);
  });

  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const {
      sut,
      updateAccessTokenRepositorySpy,
      encrypterSpy,
      loadAccountByEmailRepositorySpy
    } = makeSut();

    await sut.auth(mockAuthenticationParams());

    expect(updateAccessTokenRepositorySpy.id).toBe(
      loadAccountByEmailRepositorySpy.accountModel.id
    );
    expect(updateAccessTokenRepositorySpy.token).toBe(encrypterSpy.cipherText);
  });

  it('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositorySpy } = makeSut();
    jest
      .spyOn(updateAccessTokenRepositorySpy, 'updateAccessToken')
      .mockImplementationOnce(throwError);

    const promise = sut.auth(mockAuthenticationParams());

    expect(promise).rejects.toThrow();
  });
});
