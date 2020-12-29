import { SurveyModel } from '@/domain/models';
import { AddSurveyParams } from '@/domain/useCases';
import faker from 'faker';

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
): AddSurveyParams => ({
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
