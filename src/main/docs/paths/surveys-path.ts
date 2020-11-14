export const surveysPath = {
  get: {
    security: [
      {
        apiKeyAuth: []
      }
    ],
    tags: ['Survey'],
    summary: 'API to list all the surveys',
    description: 'Only used by **authenticated users**',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveys'
            }
          }
        }
      },
      204: {
        description: 'Sucess with no content'
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
  },
  post: {
    security: [
      {
        apiKeyAuth: []
      }
    ],
    tags: ['Survey'],
    summary: 'API to create a survey',
    description: 'Only used by **adminstrators**',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/addSurveyParams'
          }
        }
      }
    },
    responses: {
      204: {
        description: 'Sucess with no content'
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
