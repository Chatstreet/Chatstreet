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
    GetHealthResponseSuccess: {
      name: 'http-success',
      data: {
        health: 'ok',
      },
    },
    PostAuthRequestUsernameTag: {
      username: 'NekroQuest',
      tag: '7331',
      password: 'password',
    },
    PostAuthRequestEmail: {
      email: 'nekroquest@gmail.com',
      password: 'password',
    },
    PostRegisterRequest: {
      username: 'NekroQuest',
      firstName: 'David',
      lastName: 'Abderhalden',
      email: 'nekroquest@gmail.com',
      recoveryEmail: 'nikolaus@hispeed.ch',
      phoneNumber: '+41791001010',
      birthdate: '4/18/04',
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
      tag: 7331,
      email: 'nekroquest@gmail.com',
      role: 'USER',
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
    PostAuthResponseInternalServerError: {
      name: 'http-error',
      error: 'An unexpected server error occured.',
    },
    GetVerifyResponseSuccess: {
      name: 'http-success',
      data: {
        $ref: '#/definitions/GetVerifyResponseDataSuccess',
      },
    },
    GetVerifyResponseDataSuccess: {
      username: 'NekroQuest',
      tag: 7331,
      email: 'nekroquest@gmail.com',
      role: 'USER',
      exp: 1689596690,
      iat: 1689595790,
    },
    GetVerifyResponseSuccessNoToken: {
      name: 'http-success',
      data: {
        status: 'error',
        error: 'No token provided',
      },
    },
    GetVerifyResponseSuccessInvalidToken: {
      name: 'http-success',
      data: {
        status: 'error',
        error: 'Token is invalid',
      },
    },
    GetVerifyResponseInternalServerError: {
      name: 'http-error',
      error: 'An unexpected server error occured.',
    },
    PostRegisterResponseSuccess: {
      name: 'http-success',
      data: {
        username: 'Example',
        tag: 8099,
        firstName: 'Example',
        lastName: 'Example',
        email: 'example@example.ch',
        phoneNumber: '+41791001010',
        birthdate: '2004-04-17T22:00:00.000Z',
      },
    },
    PostRegisterResponseBadRequest: {
      name: 'validation-error',
      error: {
        $ref: '#/definitions/ZodValidationError',
      },
      data: {
        username: 'Example',
        firstName: 'Example',
        lastName: 'Example',
        email: 'example@example.ch',
        phoneNumber: '+417941001010',
        birthdate: '4/18/04',
      },
    },
    PostRegisterResponseInternalServerError: {
      name: 'http-error',
      error: "ER_DUP_ENTRY: Duplicate entry 'example@example.ch' for key 'email'",
    },
    GetRefreshResponseSuccess: {
      name: 'http-success',
      data: {
        username: 'NekroQuest',
        tag: 7331,
        email: 'nekroquest@gmail.com',
        role: 'USER',
      },
    },
    GetRefreshResponseBadRequest: {
      name: 'http-error',
      error: 'No refresh token provided',
    },
    GetRefreshResponseUnauthorized: {
      name: 'http-error',
      error: 'Invalid refresh token',
    },
    GetRefreshResponseInternalServerError: {
      name: 'http-error',
      error: 'An unexpected server error occured.',
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
