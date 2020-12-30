import { DbAddSurvey } from '@/data/useCases';
import { AddSurveyRepositorySpy } from '@/tests/data/mocks';
import { throwError, mockAddSurveyParams } from '@/tests/domain/mocks';

type SutTypes = {
  sut: DbAddSurvey;
  addSurveyRepositorySpy: AddSurveyRepositorySpy;
};

const makeSut = (): SutTypes => {
  const addSurveyRepositorySpy = new AddSurveyRepositorySpy();
  const sut = new DbAddSurvey(addSurveyRepositorySpy);

  return {
    sut,
    addSurveyRepositorySpy
  };
};

describe('DbAddSurvey Usecase', () => {
  it('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut();

    const surveyData = mockAddSurveyParams();
    await sut.add(surveyData);

    expect(addSurveyRepositorySpy.addSurveyParams).toEqual(surveyData);
  });

  it('should throw if AddAccountRepository throws', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut();
    jest
      .spyOn(addSurveyRepositorySpy, 'add')
      .mockImplementationOnce(throwError);

    const promise = sut.add(mockAddSurveyParams());
    await expect(promise).rejects.toThrow();
  });
});
