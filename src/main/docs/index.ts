import paths from './paths';
import schemas from './schemas';
import components from './components';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node TS',
    description: 'Node API with Clean Architecture',
    version: '1.0.0'
  },
  license: {
    name: 'ISC',
    url: 'https://www.isc.org/licenses/'
  },
  servers: [
    {
      url: '/api/v1',
      description: 'Main Server'
    }
  ],
  tags: [
    {
      name: 'Auth'
    },
    {
      name: 'Survey'
    }
  ],
  paths,
  schemas,
  components
};
