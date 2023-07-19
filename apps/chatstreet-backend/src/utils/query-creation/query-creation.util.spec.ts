import mysql from 'mysql';
import {
  AuthenticationUserDataSelectionQueryInput,
  JsonWebTokenHashInsertionQueryInput,
  RegistrationUserDataInsertionQueryInput,
  UserIdSelectionQueryInput,
} from './query-creation.types';
import QueryCreationUtil from './query-creation.util';
import { describe, expect, it } from '@jest/globals';

describe('Unit Tests - QueryCreationUtil', () => {
  describe('createAuthenticationUserDataSelectionQuery', () => {
    const defaultPayload: AuthenticationUserDataSelectionQueryInput = {
      email: 'example@example.com',
      username: 'Example',
      tag: 9999,
    };
    it('should create valid query from email input', () => {
      const queryString: string | null = QueryCreationUtil.createAuthenticationUserDataSelectionQuery({
        ...defaultPayload,
        username: null,
        tag: null,
      });
      expect(queryString).toBe("SELECT password FROM chatstreet.users WHERE email = 'example@example.com';");
    });
    it('should create valid query from username, tag input', () => {
      const queryString: string | null = QueryCreationUtil.createAuthenticationUserDataSelectionQuery({
        ...defaultPayload,
        email: null,
      });
      expect(queryString).toBe("SELECT password FROM chatstreet.users WHERE username = 'Example' AND tag = 9999;");
    });
    it('should create no query from invalid input', () => {
      const queryString: string | null = QueryCreationUtil.createAuthenticationUserDataSelectionQuery({
        email: null,
        username: null,
        tag: null,
      });
      expect(queryString).toBe(null);
    });
  });
  describe('createRegistrationUserDataInsertionQuery', () => {
    const birthdate: Date = new Date();
    const defaultPayload: RegistrationUserDataInsertionQueryInput = {
      username: 'Example',
      tag: 9999,
      firstName: 'Example',
      lastName: 'Example',
      email: 'example@example.com',
      recoveryEmail: 'recovery@example.com',
      phoneNumber: '+41795005050',
      birthdate,
      spicyPassword: 'spicy-password',
    };
    it('should create valid query with all optional & required inputs', () => {
      const queryString: string = QueryCreationUtil.createRegistrationUserDataInsertionQuery(defaultPayload);
      const expectedResponse = `INSERT INTO chatstreet.users (username, tag, first_name, last_name, email, recovery_email, phone_number, birthdate, password)
      VALUES (
        'Example',
        9999,
        'Example',
        'Example',
        'example@example.com',
        'recovery@example.com',
        '+41795005050',
        ${mysql.escape(birthdate)},
        'spicy-password');`;
      expect(queryString).toBe(expectedResponse);
    });
    it('should create valid query required inputs only', () => {
      const queryString: string = QueryCreationUtil.createRegistrationUserDataInsertionQuery({
        ...defaultPayload,
        recoveryEmail: null,
        phoneNumber: null,
        birthdate: null,
      });
      const expectedResponse = `INSERT INTO chatstreet.users (username, tag, first_name, last_name, email, recovery_email, phone_number, birthdate, password)
      VALUES (
        'Example',
        9999,
        'Example',
        'Example',
        'example@example.com',
        NULL,
        NULL,
        NULL,
        'spicy-password');`;
      expect(queryString).toBe(expectedResponse);
    });
  });
  describe('createAvailableTagSelectionQuery', () => {
    it('should create valid query', () => {
      const queryString: string = QueryCreationUtil.createAvailableTagSelectionQuery('Example');
      expect(queryString).toBe("SELECT tag FROM chatstreet.users WHERE username = 'Example'");
    });
  });
  describe('createJsonWebTokenHashInsertionQuery', () => {
    const defaultPayload: JsonWebTokenHashInsertionQueryInput = {
      userId: 1,
      jsonWebTokenHash: 'c01f10e0-2ade-4130-b3ce-66ff7019308a',
    };
    it('should create valid query', () => {
      const queryString: string = QueryCreationUtil.createJsonWebTokenHashInsertionQuery(defaultPayload);
      expect(queryString).toBe(`INSERT INTO chatstreet.json_web_token (json_web_token_id, user_id_fk)
      VALUES (
        'c01f10e0-2ade-4130-b3ce-66ff7019308a',
        1)`);
    });
  });
  describe('createUserIdSelectionQuery', () => {
    const defaultPayload: UserIdSelectionQueryInput = {
      email: 'example@example.com',
      username: 'Example',
      tag: 9999,
    };
    it('should create valid query from email input', () => {
      const queryString: string | null = QueryCreationUtil.createUserIdSelectionQuery({
        ...defaultPayload,
        username: null,
        tag: null,
      });
      expect(queryString).toBe("SELECT user_id FROM chatstreet.users WHERE email = 'example@example.com';");
    });
    it('should create valid query from username, tag input', () => {
      const queryString: string | null = QueryCreationUtil.createUserIdSelectionQuery({
        ...defaultPayload,
        email: null,
      });
      expect(queryString).toBe("SELECT user_id FROM chatstreet.users WHERE username = 'Example' AND tag = 9999;");
    });
    it('should create no query from invalid input', () => {
      const queryString: string | null = QueryCreationUtil.createUserIdSelectionQuery({
        email: null,
        username: null,
        tag: null,
      });
      expect(queryString).toBe(null);
    });
  });
  describe('createJsonWebTokenRemovalQuery', () => {
    it('should create valid query', () => {
      const queryString: string = QueryCreationUtil.createJsonWebTokenRemovalQuery(1);
      expect(queryString).toBe('DELETE FROM chatstreet.json_web_token WHERE user_id_fk = 1;');
    });
  });
  describe('createUserInformationFromJwtHashSelectionQuery', () => {
    it('should create valid query', () => {
      const queryString: string = QueryCreationUtil.createUserInformationFromJwtHashSelectionQuery(
        'c01f10e0-2ade-4130-b3ce-66ff7019308a'
      );
      expect(queryString).toBe(`SELECT users.username, users.tag, users.email, users.role 
      FROM chatstreet.json_web_token
      INNER JOIN chatstreet.users ON json_web_token.user_id_fk = users.user_id WHERE json_web_token.json_web_token_id = 'c01f10e0-2ade-4130-b3ce-66ff7019308a';`);
    });
  });
});
