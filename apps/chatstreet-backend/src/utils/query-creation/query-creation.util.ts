import mysql from 'mysql';
import {
  AuthenticationUserDataSelectionQueryInput,
  RegistrationUserDataInsertionQueryInput,
  JsonWebTokenHashInsertionQueryInput,
  UserIdSelectionQueryInput,
} from './query-creation.types';

type TableMapType = Record<'USERS_TABLE' | 'JSON_WEB_TOKEN_TABLE', string>;

export default class QueryCreationUtil {
  private static tableMap: TableMapType = {
    USERS_TABLE: 'chatstreet.users',
    JSON_WEB_TOKEN_TABLE: 'chatstreet.json_web_token',
  };

  public static createAuthenticationUserDataSelectionQuery(
    payload: AuthenticationUserDataSelectionQueryInput
  ): string | null {
    const usernameHasTag = !!payload.username && !!payload.tag;
    if (!payload.email && !usernameHasTag) {
      return null;
    }
    return (
      `SELECT password FROM ${this.tableMap.USERS_TABLE} WHERE ` +
      `${[
        `${payload.email ? `email = ${mysql.escape(payload.email)}` : ''}`,
        `${payload.username ? `username = ${mysql.escape(payload.username)}` : ''}`,
        `${payload.tag ? `tag = ${mysql.escape(payload.tag)}` : ''}`,
      ]
        .filter((partial: string) => partial !== '')
        .join(' AND ')};`
    );
  }

  public static createRegistrationUserDataInsertionQuery(payload: RegistrationUserDataInsertionQueryInput): string {
    return `INSERT INTO ${
      this.tableMap.USERS_TABLE
    } (username, tag, first_name, last_name, email, recovery_email, phone_number, birthdate, password)
      VALUES (
        ${mysql.escape(payload.username)},
        ${mysql.escape(payload.tag)},
        ${mysql.escape(payload.firstName)},
        ${mysql.escape(payload.lastName)},
        ${mysql.escape(payload.email)},
        ${mysql.escape(payload.recoveryEmail)},
        ${mysql.escape(payload.phoneNumber)},
        ${mysql.escape(payload.birthdate)},
        ${mysql.escape(payload.spicyPassword)});`.trim();
  }

  public static createAvailableTagSelectionQuery(username: string): string {
    return `SELECT tag FROM ${this.tableMap.USERS_TABLE} WHERE username = ${mysql.escape(username)}`;
  }

  public static createJsonWebTokenHashInsertionQuery(payload: JsonWebTokenHashInsertionQueryInput): string {
    // doesn't need escaping (no direct user input)
    return `INSERT INTO ${this.tableMap.JSON_WEB_TOKEN_TABLE} (json_web_token_id, user_id_fk)
      VALUES (
        ${mysql.escape(payload.jsonWebTokenHash)},
        ${payload.userId})`;
  }

  public static createUserIdSelectionQuery(payload: UserIdSelectionQueryInput): string | null {
    const usernameHasTag = !!payload.username && !!payload.tag;
    if (!payload.email && !usernameHasTag) {
      return null;
    }
    return (
      `SELECT user_id FROM ${this.tableMap.USERS_TABLE} WHERE ` +
      `${[
        `${payload.email ? `email = ${mysql.escape(payload.email)}` : ''}`,
        `${payload.username ? `username = ${mysql.escape(payload.username)}` : ''}`,
        `${payload.tag ? `tag = ${mysql.escape(payload.tag)}` : ''}`,
      ]
        .filter((partial: string) => partial !== '')
        .join(' AND ')};`
    );
  }

  public static createJsonWebTokenRemovalQuery(userId: number): string {
    // doesn't need escaping (no direct user input)
    return `DELETE FROM ${this.tableMap.JSON_WEB_TOKEN_TABLE} WHERE user_id_fk = ${userId};`;
  }

  public static createUserInformationFromJwtHashSelectionQuery(jwtHash: string): string {
    return `SELECT users.username, users.tag, users.email, users.role 
      FROM ${this.tableMap.JSON_WEB_TOKEN_TABLE}
      INNER JOIN ${
        this.tableMap.USERS_TABLE
      } ON json_web_token.user_id_fk = users.user_id WHERE json_web_token.json_web_token_id = ${mysql.escape(
      jwtHash
    )};`;
  }
}
