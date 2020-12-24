import { MissingParamError, ServerError } from '@/presentation/errors';
import {
  badRequest,
  serverError,
  noContent
} from '@/presentation/helpers/http/http-helper';
import { AddSurveyController } from './add-survey-controller';
import { HttpRequest, Validation } from './add-survey-protocols';
import { throwNullStackError } from '@/domain/test/test-helper';
import { mockValidation } from '@/validation/test';
import { AddSurveySpy } from '@/presentation/test';

const mockRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ],
    date: new Date()
  }
});

type SutTypes = {
  sut: AddSurveyController;
  validationStub: Validation;
  addSurveySpy: AddSurveySpy;
};

const makeSut = (): SutTypes => {
  const validationStub = mockValidation();
  const addSurveySpy = new AddSurveySpy();
  const sut = new AddSurveyController(validationStub, addSurveySpy);
  return { sut, validationStub, addSurveySpy };
};

describe('AddSurvey Controller', () => {
  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = mockRequest();
    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'));

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any_field'))
    );
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
