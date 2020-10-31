import { MissingParamError } from '@/presentation/errors';
import { badRequest } from '@/presentation/helpers/http/http-helper';
import { AddSurveyController } from './add-survey-controller';
import { HttpRequest, CustomError, Validation } from './add-survey-protocols';

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ]
  }
});

interface SutType {
  sut: AddSurveyController;
  validationStub: Validation;
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(data: any): CustomError {
      return null;
    }
  }

  return new ValidationStub();
};

const makeSut = (): SutType => {
  const validationStub = makeValidation();
  const sut = new AddSurveyController(validationStub);
  return { sut, validationStub };
};

describe('AddSurvey Controller', () => {
  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'));

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any_field'))
    );
  });
});
