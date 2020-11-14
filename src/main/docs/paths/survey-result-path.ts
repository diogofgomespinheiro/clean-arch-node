export const surveyResultPath = {
  put: {
    security: [
      {
        apiKeyAuth: []
      }
    ],
    tags: ['Survey'],
    summary: 'API to create or update a survey result',
    description: 'Only used by **authenticated users**',
    parameters: [
      {
        in: 'path',
        name: 'surveyId',
        description: 'ID from the survey',
        required: true,
        schema: {
          type: 'string'
        }
      }
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/saveSurveyParams'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Sucess',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyResult'
            }
          }
        }
      },
      403: {
        $ref: '#/components/forbidden'
      },
      404: {
        $ref: '#/components/notFound'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
};
