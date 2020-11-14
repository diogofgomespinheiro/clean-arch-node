export const errorSchema = {
  type: 'object',
  properties: {
    field: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    message: {
      type: 'string'
    },
    stack: {
      type: 'string'
    }
  },
  required: ['name', 'message']
};

export const errorsSchema = {
  type: 'array',
  items: {
    $ref: '#/schemas/error'
  }
};
