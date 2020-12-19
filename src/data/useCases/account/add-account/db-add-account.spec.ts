import { DbAddAccount } from './db-add-account';
import { mockAccountModel, mockAddAccountParams } from '@/domain/test';
import {
  AddAccountRepository,
  AccountModel,
  LoadAccountByEmailRepository
} from './db-add-account-protocols';
import { throwError } from '@/domain/test/test-helper';
import { mockAddAccountRepository, HasherSpy } from '@/data/test';

const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      return null;
    }
  }

  return new LoadAccountByEmailRepositoryStub();
};

type SutTypes = {
  sut: DbAddAccount;
  hasherSpy: HasherSpy;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
};

const makeSut = (): SutTypes => {
  const hasherSpy = new HasherSpy();
  const addAccountRepositoryStub = mockAddAccountRepository();
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  const sut = new DbAddAccount(
    hasherSpy,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  );

  return {
    sut,
    hasherSpy,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
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
    const { sut, addAccountRepositoryStub, hasherSpy } = makeSut();

    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

    const addAccountParams = mockAddAccountParams();

    await sut.add(addAccountParams);
    await expect(addSpy).toHaveBeenCalledWith({
      ...addAccountParams,
      password: hasherSpy.digest
    });
  });

  it('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockImplementationOnce(throwError);

    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  it('should return an account on success', async () => {
    const { sut } = makeSut();

    const account = await sut.add(mockAddAccountParams());
    expect(account).toEqual(mockAccountModel());
  });

  it('should return null if LoadAccountByEmailRepostiory returns an account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockImplementationOnce(async () => {
        return mockAccountModel();
      });

    const account = await sut.add(mockAddAccountParams());
    expect(account).toBe(null);
  });

  it('should call LoadAccountByEmailRepostiory with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');

    const addAccountParams = mockAddAccountParams();
    await sut.add(addAccountParams);

    expect(loadSpy).toHaveBeenCalledWith(addAccountParams.email);
  });

  it('should throw if LoadAccountByEmailRepostiory throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockImplementationOnce(throwError);

    const promise = sut.add(mockAddAccountParams());

    expect(promise).rejects.toThrow();
  });
});
