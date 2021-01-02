import { DbAddAccount } from '@/data/useCases';
import { mockAddAccountParams, throwError } from '@/tests/domain/mocks';
import {
  AddAccountRepositorySpy,
  VerifyAccountByEmailRepositorySpy,
  HasherSpy
} from '@/tests/data/mocks';

type SutTypes = {
  sut: DbAddAccount;
  hasherSpy: HasherSpy;
  addAccountRepositorySpy: AddAccountRepositorySpy;
  verifyAccountByEmailRepositorySpy: VerifyAccountByEmailRepositorySpy;
};

const makeSut = (): SutTypes => {
  const hasherSpy = new HasherSpy();
  const addAccountRepositorySpy = new AddAccountRepositorySpy();
  const verifyAccountByEmailRepositorySpy = new VerifyAccountByEmailRepositorySpy();
  const sut = new DbAddAccount(
    hasherSpy,
    addAccountRepositorySpy,
    verifyAccountByEmailRepositorySpy
  );

  return {
    sut,
    hasherSpy,
    addAccountRepositorySpy,
    verifyAccountByEmailRepositorySpy
  };
};

describe('DbAddAccount Usecase', () => {
  it('should call Hasher with correct password', async () => {
    const { sut, hasherSpy } = makeSut();
    const addAccountParams = mockAddAccountParams();

    await sut.add(addAccountParams);
    expect(hasherSpy.plainText).toBe(addAccountParams.password);
  });

  it('should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut();
    jest.spyOn(hasherSpy, 'hash').mockImplementationOnce(throwError);

    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  it('should call AddAccountRepository with correct data', async () => {
    const { sut, addAccountRepositorySpy, hasherSpy } = makeSut();

    const addAccountParams = mockAddAccountParams();
    await sut.add(addAccountParams);

    await expect(addAccountRepositorySpy.addAccountParams).toEqual({
      ...addAccountParams,
      password: hasherSpy.digest
    });
  });

  it('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositorySpy } = makeSut();
    jest
      .spyOn(addAccountRepositorySpy, 'add')
      .mockImplementationOnce(throwError);

    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  it('should return an account on success', async () => {
    const { sut, addAccountRepositorySpy } = makeSut();

    const account = await sut.add(mockAddAccountParams());
    expect(account).toEqual(addAccountRepositorySpy.accountModel);
  });

  it('should return null if VerifyAccountByEmailRepository returns true', async () => {
    const { sut, verifyAccountByEmailRepositorySpy } = makeSut();
    verifyAccountByEmailRepositorySpy.exists = true;

    const account = await sut.add(mockAddAccountParams());
    expect(account).toBe(null);
  });

  it('should call VerifyAccountByEmailRepository with correct email', async () => {
    const { sut, verifyAccountByEmailRepositorySpy } = makeSut();

    const addAccountParams = mockAddAccountParams();
    await sut.add(addAccountParams);

    expect(verifyAccountByEmailRepositorySpy.email).toBe(
      addAccountParams.email
    );
  });

  it('should throw if VerifyAccountByEmailRepository throws', async () => {
    const { sut, verifyAccountByEmailRepositorySpy } = makeSut();
    jest
      .spyOn(verifyAccountByEmailRepositorySpy, 'verifyByEmail')
      .mockImplementationOnce(throwError);

    const promise = sut.add(mockAddAccountParams());

    expect(promise).rejects.toThrow();
  });
});
