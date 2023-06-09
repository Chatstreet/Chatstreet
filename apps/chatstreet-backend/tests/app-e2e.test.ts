import request, { agent as supertest } from 'supertest';
import app, { server } from '@app/main';
import { describe, expect, it, afterAll } from '@jest/globals';

jest.mock('@app/services/database-operations.service');

describe('Application E2E Tests', () => {
  describe('API-V1 /api/v1', () => {
    describe('Secure Endpoints /secure', () => {
      it('should return 401 with missing authorization headers', async () => {
        const response: request.Response = await request(app).get('/api/v1/secure/*');
        expect(response.statusCode).toEqual(401);
        expect(response.body.name).toBe('http-error');
        expect(response.body.error).toBe('Unauthorized, missing authorization headers');
      });
      it('should return 401 with invalid token', async () => {
        const agent = supertest(app);
        agent.auth(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik5la3JvUXVlc3QiLCJ0YWciOjczMzEsImVtYWlsIjoibmVrcm9xdWVzdEBnbWFpbC5jb20iLCJpYXQiOjE2ODYzMzg2ODEsImV4cCI6MTY4Njk0MzQ4MX0.sfTdpqCCeaBStQ28ZWtvUMFPrTBxMbP29zwSNupx2Q',
          { type: 'bearer' }
        );
        const response: request.Response = await agent.get('/api/v1/secure/*');
        expect(response.statusCode).toEqual(401);
        expect(response.body.name).toBe('http-error');
        expect(response.body.error).toBe('Unauthorized, invalid token');
      });
    });
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
  });
});
