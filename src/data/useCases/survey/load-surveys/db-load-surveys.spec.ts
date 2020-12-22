import { DbLoadSurveys } from './db-load-surveys';
import { throwError } from '@/domain/test/test-helper';
import { LoadSurveysRepositorySpy } from '@/data/test';

type SutTypes = {
  sut: DbLoadSurveys;
  loadSurveysRepositorySpy: LoadSurveysRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadSurveysRepositorySpy = new LoadSurveysRepositorySpy();
  const sut = new DbLoadSurveys(loadSurveysRepositorySpy);
  return { sut, loadSurveysRepositorySpy };
};

describe('DbLoadSurveys', () => {
  it('should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    await sut.load();
    expect(loadSurveysRepositorySpy.callsCount).toBe(1);
  });

  it('should return a list of Surveys on sucess', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    const surveys = await sut.load();
    expect(surveys).toEqual(loadSurveysRepositorySpy.surveyModels);
  });

  it('should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    jest
      .spyOn(loadSurveysRepositorySpy, 'loadAll')
      .mockImplementationOnce(throwError);

    const promise = sut.load();
    await expect(promise).rejects.toThrow();
  });
});
