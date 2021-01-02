/* eslint-disable no-undef */
import { DbVerifySurveyById } from '@/data/useCases';
import { throwError } from '@/tests/domain/mocks';
import { VerifySurveyByIdRepositorySpy } from '@/tests/data/mocks';
import faker from 'faker';

type SutTypes = {
  sut: DbVerifySurveyById;
  verifySurveyByIdRepositorySpy: VerifySurveyByIdRepositorySpy;
};

const makeSut = (): SutTypes => {
  const verifySurveyByIdRepositorySpy = new VerifySurveyByIdRepositorySpy();
  const sut = new DbVerifySurveyById(verifySurveyByIdRepositorySpy);
  return { sut, verifySurveyByIdRepositorySpy };
};

let surveyId: string;

describe('DbVerifySurveyById', () => {
  beforeEach(() => {
    surveyId = faker.random.uuid();
  });

  it('should call VerifySurveyByIdRepository', async () => {
    const { sut, verifySurveyByIdRepositorySpy } = makeSut();
    await sut.verifyById(surveyId);
    expect(verifySurveyByIdRepositorySpy.surveyId).toBe(surveyId);
  });

  it('should return true if VerifySurveyByIdRepository returns true', async () => {
    const { sut } = makeSut();
    const exists = await sut.verifyById(surveyId);
    expect(exists).toBe(true);
  });

  it('should return false if VerifySurveyByIdRepository returns false', async () => {
    const { sut, verifySurveyByIdRepositorySpy } = makeSut();
    verifySurveyByIdRepositorySpy.result = false;
    const exists = await sut.verifyById(surveyId);
    expect(exists).toBe(false);
  });

  it('should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, verifySurveyByIdRepositorySpy } = makeSut();
    jest
      .spyOn(verifySurveyByIdRepositorySpy, 'verifyById')
      .mockImplementationOnce(throwError);

    const promise = sut.verifyById(surveyId);
    await expect(promise).rejects.toThrow();
  });
});
