import { DbAddAccount } from './db-add-account';
import { mockAccountModel, mockAddAccountParams } from '@/domain/test';
import { throwError } from '@/domain/test/test-helper';
import {
  AddAccountRepositorySpy,
  LoadAccountByEmailRepositorySpy,
  HasherSpy
} from '@/data/test';

type SutTypes = {
  sut: DbAddAccount;
  hasherSpy: HasherSpy;
  addAccountRepositorySpy: AddAccountRepositorySpy;
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy;
};

const makeSut = (): SutTypes => {
  const hasherSpy = new HasherSpy();
  const addAccountRepositorySpy = new AddAccountRepositorySpy();
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy();
  loadAccountByEmailRepositorySpy.accountModel = null;
  const sut = new DbAddAccount(
    hasherSpy,
    addAccountRepositorySpy,
    loadAccountByEmailRepositorySpy
  );

  return {
    sut,
    hasherSpy,
    addAccountRepositorySpy,
    loadAccountByEmailRepositorySpy
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

  it('should return null if LoadAccountByEmailRepostiory returns an account', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    loadAccountByEmailRepositorySpy.accountModel = mockAccountModel();

    const account = await sut.add(mockAddAccountParams());
    expect(account).toBe(null);
  });

  it('should call LoadAccountByEmailRepostiory with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();

    const addAccountParams = mockAddAccountParams();
    await sut.add(addAccountParams);

    expect(loadAccountByEmailRepositorySpy.email).toBe(addAccountParams.email);
  });

  it('should throw if LoadAccountByEmailRepostiory throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail')
      .mockImplementationOnce(throwError);

    const promise = sut.add(mockAddAccountParams());

    expect(promise).rejects.toThrow();
  });
});
