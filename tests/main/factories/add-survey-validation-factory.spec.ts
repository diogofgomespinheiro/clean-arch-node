import { makeAddSurveyValidation } from '@/main/factories/controllers/survey/add-survey/add-survey-validation-factory';
import {
  RequiredFieldValidation,
  ValidationComposite
} from '@/validation/validators';
import { Validation } from '@/presentation/protocols';

jest.mock('@/validation/validators/validation-composite');

describe('LoginValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation();

    const validations: Validation[] = [];

    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field));
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
