import { MissingParamError, ServerError } from '@/presentation/errors';
import {
  badRequest,
  serverError,
  noContent
} from '@/presentation/helpers/http/http-helper';
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey/add-survey-controller';
import { HttpRequest } from '@/presentation/protocols';
import { throwNullStackError } from '@/tests/domain/mocks';
import { ValidationSpy } from '@/tests/validation/mocks';
import { AddSurveySpy } from '@/tests/presentation/mocks';
import faker from 'faker';

const mockRequest = (): HttpRequest => ({
  body: {
    question: faker.random.words(),
    answers: [
      {
        image: faker.image.imageUrl(),
        answer: faker.random.word()
      }
    ],
    date: new Date()
  }
});

type SutTypes = {
  sut: AddSurveyController;
  validationSpy: ValidationSpy;
  addSurveySpy: AddSurveySpy;
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const addSurveySpy = new AddSurveySpy();
  const sut = new AddSurveyController(validationSpy, addSurveySpy);
  return { sut, validationSpy, addSurveySpy };
};

describe('AddSurvey Controller', () => {
  it('should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut();

    const httpRequest = mockRequest();
    await sut.handle(httpRequest);

    expect(validationSpy.input).toEqual(httpRequest.body);
  });

  it('should return 400 if validation returns an error', async () => {
    const { sut, validationSpy } = makeSut();
    const field = faker.random.word();
    validationSpy.error = new MissingParamError(field);

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(badRequest(new MissingParamError(field)));
  });

  it('should call AddSurvey with correct values', async () => {
    const { sut, addSurveySpy } = makeSut();

    const httpRequest = mockRequest();
    await sut.handle(httpRequest);

    expect(addSurveySpy.addSurveyParams).toEqual(httpRequest.body);
  });

  it('should return 500 if AddSurvey throws an exception', async () => {
    const { sut, addSurveySpy } = makeSut();

    jest.spyOn(addSurveySpy, 'add').mockImplementationOnce(throwNullStackError);

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  it('should return 204 on sucess', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(noContent());
  });
});
