import swaggerAutogen from 'swagger-autogen';
import EnvironmentsConfig from '../../environments/environments.config';

const options = {
  openapi: null,
  language: 'en-US',
  disableLogs: false,
  autoHeaders: true,
  autoQuery: true,
  autoBody: true,
};

const doc = {
  info: {
    version: '1.0.0',
    title: 'Chatstreet-Backend-MiSe',
    description: 'Micro-Service for the Chatstreet backend application.',
  },
  host: `${EnvironmentsConfig.getInstance().getHost()}:${EnvironmentsConfig.getInstance().getPort()}`,
  basePath: '/api/v1',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [],
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'jwt',
      name: 'JWT',
      description: 'All routes on **/secure/** are secured by the authentication (see authentication).',
    },
    definitions: {},
  },
};

const outputFile = './src/utils/swagger-autogen/swagger-output.json';
const endpointsFiles = ['./src/main.ts'];

swaggerAutogen(options)(outputFile, endpointsFiles, doc);
