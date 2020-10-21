import { DbAddAccount } from './db-add-account';
import {
  AddAccountModel,
  AddAccountRepository,
  AccountModel,
  Hasher
} from './db-add-account-protocols';

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
});

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
});

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return 'hashed_password';
    }
  }

  return new HasherStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      return makeFakeAccount();
    }
  }

  return new AddAccountRepositoryStub();
};

interface SutTypes {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub);

  return { sut, hasherStub: hasherStub, addAccountRepositoryStub };
};

describe('DbAddAccount Usecase', () => {
  it('should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut();
    const hashSpy = jest.spyOn(hasherStub, 'hash');

    const accountData = makeFakeAccountData();

    await sut.add(accountData);
    expect(hashSpy).toHaveBeenCalledWith(accountData.password);
  });

  it('should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(async () => {
      throw new Error();
    });

    const promise = sut.add(makeFakeAccountData());
    await expect(promise).rejects.toThrow();
  });

  it('should call AddAccountRepository with correct data', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();

    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

    const accountData = makeFakeAccountData();

    await sut.add(accountData);
    await expect(addSpy).toHaveBeenCalledWith({
      ...accountData,
      password: 'hashed_password'
    });
  });

  it('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockImplementationOnce(async () => {
        throw new Error();
      });

    const promise = sut.add(makeFakeAccountData());
    await expect(promise).rejects.toThrow();
  });

  it('should return an account on success', async () => {
    const { sut } = makeSut();

    const account = await sut.add(makeFakeAccountData());
    expect(account).toEqual(makeFakeAccount());
  });
});
