import { DbLoadSurveys } from './db-load-surveys';
import { LoadSurveysRepository } from './db-load-surveys-protocols';
import { throwError } from '@/domain/test/test-helper';
import { mockSurveyModels } from '@/domain/test';
import { mockLoadSurveysRepository } from '@/data/test';

type SutTypes = {
  sut: DbLoadSurveys;
  loadSurveysRepositoryStub: LoadSurveysRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository();
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub);
  return { sut, loadSurveysRepositoryStub };
};

describe('DbLoadSurveys', () => {
  it('should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll');
    await sut.load();
    expect(loadAllSpy).toHaveBeenCalled();
  });

  it('should return a list of Surveys on sucess', async () => {
    const { sut } = makeSut();
    const surveys = await sut.load();
    expect(surveys).toEqual(mockSurveyModels());
  });

  it('should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveysRepositoryStub, 'loadAll')
      .mockImplementationOnce(throwError);

    const promise = sut.load();
    await expect(promise).rejects.toThrow();
  });
});
