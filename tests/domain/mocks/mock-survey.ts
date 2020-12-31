import { SurveyModel } from '@/domain/models';
import faker from 'faker';
import { AddSurvey } from '../useCases';

export const mockSurveyModel = (): SurveyModel => ({
  id: faker.random.uuid(),
  question: faker.random.words(),
  answers: [
    {
      answer: faker.random.word()
    },
    {
      answer: faker.random.word(),
      image: faker.image.imageUrl()
    }
  ],
  date: faker.date.recent()
});

export const mockSurveyModels = (): SurveyModel[] => {
  return [
    {
      id: faker.random.uuid(),
      question: faker.random.words(),
      answers: [
        {
          image: faker.image.imageUrl(),
          answer: faker.random.word()
        }
      ],
      date: faker.date.recent()
    },
    {
      id: faker.random.uuid(),
      question: faker.random.words(),
      answers: [
        {
          image: faker.image.imageUrl(),
          answer: faker.random.word()
        }
      ],
      date: faker.date.recent()
    }
  ];
};

export const mockAddSurveyParams = (
  question = faker.random.words()
): AddSurvey.Params => ({
  question,
  answers: [
    {
      image: faker.image.imageUrl(),
      answer: faker.random.word()
    },
    {
      answer: faker.random.word()
    }
  ],
  date: faker.date.recent()
});
