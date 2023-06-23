import request, { agent as supertest } from 'supertest';
import app, { server } from '@app/main';
import { describe, expect, it, afterAll } from '@jest/globals';
import logger from 'npmlog';

jest.mock('@app/services/database-operations.service');

describe('Application E2E Tests', () => {
  const log: Console['log'] = console.log;
  beforeAll(() => {
    logger.pause();
    console.log = () => null;
  });
  afterAll(() => {
    console.log = log;
  });
  describe('API-V1 /api/v1', () => {
    const apiV1 = '/api/v1';
    describe('Secure Endpoints /secure', () => {
      it('should return 401 with missing authorization headers', async () => {
        const response: request.Response = await request(app).get(`${apiV1}/secure/*`);
        expect(response.statusCode).toEqual(401);
        expect(response.body.name).toEqual('http-error');
        expect(response.body.error).toEqual('Unauthorized, missing authorization headers');
      });
      it('should return 401 with invalid token', async () => {
        const agent = supertest(app);
        agent.auth(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik5la3JvUXVlc3QiLCJ0YWciOjczMzEsImVtYWlsIjoibmVrcm9xdWVzdEBnbWFpbC5jb20iLCJpYXQiOjE2ODYzMzg2ODEsImV4cCI6MTY4Njk0MzQ4MX0.sfTdpqCCeaBStQ28ZWtvUMFPrTBxMbP29zwSNupx2Q',
          { type: 'bearer' }
        );
        const response: request.Response = await agent.get(`${apiV1}/secure/*`);
        expect(response.statusCode).toEqual(401);
        expect(response.body.name).toEqual('http-error');
        expect(response.body.error).toEqual('Unauthorized, invalid token');
      });
    });
    describe('Health Endpoint /health', () => {
      it('should be healthy', async () => {
        const response: request.Response = await request(app).get(`${apiV1}/health`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.data.health).toEqual('ok');
      });
    });
    describe('Insecure Token Endpoints /token', () => {
      describe('Authentication Endpoint /auth', () => {
        it('should be able to authenticate with email and password', async () => {
          const req: object = {
            email: 'nekroquest@gmail.com',
            password: 'password',
          };
          const response: request.Response = await request(app).post(`${apiV1}/token/auth`).send(req);
          expect(response.statusCode).toEqual(200);
          expect(response.body.name).toEqual('http-success');
        });
        it('should be able to authenticate with username, tag and password', async () => {
          const req: object = {
            username: 'NekroQuest',
            tag: '7331',
            password: 'password',
          };
          const response: request.Response = await request(app).post(`${apiV1}/token/auth`).send(req);
          expect(response.statusCode).toEqual(200);
          expect(response.body.name).toEqual('http-success');
        });
        it('should not be able to authenticate with no password but email', async () => {
          const req: object = {
            email: 'nekroquest@gmail.com',
          };
          const response: request.Response = await request(app).post(`${apiV1}/token/auth`).send(req);
          expect(response.statusCode).toEqual(400);
          expect(response.body.name).toEqual('validation-error');
        });
        it('should not be able to authenticate with no password but username, tag', async () => {
          const req: object = {
            username: 'NekroQuest',
            tag: '7331',
          };
          const response: request.Response = await request(app).post(`${apiV1}/token/auth`).send(req);
          expect(response.statusCode).toEqual(400);
          expect(response.body.name).toEqual('validation-error');
        });
        it('should not be able to authenticate with username no tag', async () => {
          const req: object = {
            username: 'NekroQuest',
            password: 'password',
          };
          const response: request.Response = await request(app).post(`${apiV1}/token/auth`).send(req);
          expect(response.statusCode).toEqual(400);
          expect(response.body.name).toEqual('validation-error');
        });
        it('should not be able to authenticate with username, tag and email', async () => {
          const req: object = {
            username: 'NekroQuest',
            tag: '7331',
            email: 'nekroquest@gmail.com',
          };
          const response: request.Response = await request(app).post(`${apiV1}/token/auth`).send(req);
          expect(response.statusCode).toEqual(400);
          expect(response.body.name).toEqual('validation-error');
        });
      });
    });
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
  });
});
