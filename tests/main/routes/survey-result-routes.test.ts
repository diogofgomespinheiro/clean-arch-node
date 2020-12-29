import request from 'supertest';
import { sign } from 'jsonwebtoken';
import { hash } from 'bcrypt';
import faker from 'faker';

import app from '@/main/config/app';
import env from '@/main/config/env';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { SurveyModel } from '@/domain/models/survey';

const makeAccessToken = async (role?: string): Promise<string> => {
  const accountCollection = await MongoHelper.getCollection('accounts');
  const password = await hash('123456', env.defaultSalt);
  const res = await accountCollection.insertOne({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    ...(role && { role })
  });

  const id = res.ops[0]._id;
  const accessToken = sign({ id }, env.jwtSecret);
  await accountCollection.updateOne(
    {
      _id: id
    },
    {
      $set: {
        accessToken
      }
    }
  );

  return accessToken;
};

const makeSurvey = async (): Promise<SurveyModel> => {
  const surveyCollection = await MongoHelper.getCollection('surveys');
  const res = await surveyCollection.insertOne({
    question: faker.random.words(),
    answers: [
      {
        answer: faker.random.word(),
        image: faker.image.imageUrl()
      },
      {
        answer: faker.random.word()
      }
    ],
    date: faker.date.recent()
  });

  return MongoHelper.map(res.ops[0]);
};

describe('Survey Results Routes', () => {
  describe('PUT /surveys/:surveyId/results', () => {
    it('should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/v1/surveys/any_id/results')
        .send({
          answer: faker.random.word()
        })
        .expect(403);
    });

    it('should return 200 on save survey result with accessToken', async () => {
      const accessToken = await makeAccessToken();
      const survey = await makeSurvey();

      await request(app)
        .put(`/api/v1/surveys/${survey.id}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: survey.answers[0].answer
        })
        .expect(200);
    });
  });

  describe('GET /surveys/:surveyId/results', () => {
    it('should return 403 on load survey result without accessToken', async () => {
      await request(app).get('/api/v1/surveys/any_id/results').expect(403);
    });

    it('should return 200 on save survey result with accessToken', async () => {
      const accessToken = await makeAccessToken();
      const survey = await makeSurvey();

      await request(app)
        .get(`/api/v1/surveys/${survey.id}/results`)
        .set('x-access-token', accessToken)
        .expect(200);
    });
  });
});
