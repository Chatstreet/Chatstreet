import request from 'supertest';
import app, { server } from '@app/main';
import { describe, expect, it, afterAll } from '@jest/globals';

jest.mock('@app/services/database-operations.service');

describe('Application E2E Tests', () => {
  it('This is just a demonstrational test', async () => {
    const response: request.Response = await request(app).get('/');
    expect(response.statusCode).toEqual(404);
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
  });
});
