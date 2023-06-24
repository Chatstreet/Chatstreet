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
  basePath: '/',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Miscellaneous',
      description: 'Endpoints for any other services.',
    },
    {
      name: 'Authentication',
      description: 'Endpoints for all of the authentication related actions.',
    },
  ],
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'jwt',
      name: 'JWT',
      description: 'All routes on **/secure/** are secured by the authentication (see authentication).',
    },
  },
  definitions: {
    PostAuthRequestUsernameTag: {
      username: 'NekroQuest',
      tag: '7331',
      password: 'password',
    },
    PostAuthRequestEmail: {
      email: 'nekroquest@gmail.com',
      password: 'password',
    },
    PostAuthResponseSuccess: {
      name: 'http-success',
      data: {
        $ref: '#/definitions/PostAuthResponseDataSuccess',
      },
    },
    PostAuthResponseDataSuccess: {
      username: 'NekroQuest',
      email: 'nekroquest@gmail.com',
      tag: 7331,
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik5la3JvUXVlc3QiLCJ0YWciOjczMzEsImVtYWlsIjoibmVrcm9xdWVzdEBnbWFpbC5jb20iLCJpYXQiOjE2ODc2MjczODksImV4cCI6MTY4ODIzMjE4OX0.mz4MFhQEnzqcxJW6dN7lY2Q9BmFGB1kgcubjnBdwKxM',
    },
    PostAuthResponseBadRequest: {
      name: 'validation-error',
      error: {
        $ref: '#/definitions/ZodValidationError',
      },
      data: {
        email: 'nekroquest@gmail.com',
      },
    },
    PostAuthResponseUnauthorized: {
      name: 'http-error',
      error: 'Invalid credentials',
    },
    GetHealthResponseSuccess: {
      name: 'http-success',
      data: {
        health: 'ok',
      },
    },
    ZodValidationError: {
      issues: [
        {
          code: 'custom',
          path: ['parameter'],
          message: 'Parameter is mandatory',
        },
      ],
      name: 'ZodError',
    },
  },
};

const outputFile = './src/utils/swagger-autogen/swagger-output.json';
const endpointsFiles = ['./src/main.ts'];

swaggerAutogen(options)(outputFile, endpointsFiles, doc);
