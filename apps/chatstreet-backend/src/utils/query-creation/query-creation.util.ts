import mysql from 'mysql';

type TableMapType = Record<'USERS_TABLE' | 'JSON_WEB_TOKEN_TABLE', string>;

// TODO: Create unit tests
export default class QueryCreationUtil {
  private static tableMap: TableMapType = {
    USERS_TABLE: 'chatstreet.users',
    JSON_WEB_TOKEN_TABLE: 'chatstreet.json_web_token',
  };

  public static createAuthenticationUserDataSelectionQuery(
    email: string | null,
    username: string | null,
    tag: number | null
  ): string {
    return (
      `SELECT password FROM ${this.tableMap.USERS_TABLE} WHERE ` +
      `${[
        `${email ? `email = ${mysql.escape(email)}` : ''}`,
        `${username ? `username = ${mysql.escape(username)}` : ''}`,
        `${tag ? `tag = ${mysql.escape(tag)}` : ''}`,
      ]
        .filter((partial: string) => partial !== '')
        .join(' AND ')}`
    );
  }

  public static createRegistrationUserDataInsertionQuery(
    username: string,
    tag: number,
    firstName: string,
    lastName: string,
    email: string,
    recoveryEmail: string | null,
    phoneNumber: string | null,
    birthdate: Date | null,
    spicyPassword: string
  ): string {
    return `INSERT INTO ${
      this.tableMap.USERS_TABLE
    } (username, tag, first_name, last_name, email, recovery_email, phone_number, birthdate, password)
      VALUES (
        ${mysql.escape(username)}, 
        ${mysql.escape(tag)}, 
        ${mysql.escape(firstName)}, 
        ${mysql.escape(lastName)}, 
        ${mysql.escape(email)}, 
        ${mysql.escape(recoveryEmail)}, 
        ${mysql.escape(phoneNumber)}, 
        ${mysql.escape(birthdate)}, 
        ${mysql.escape(spicyPassword)})`;
  }

  public static createAvailableTagSelectionQuery(username: string): string {
    return `SELECT tag FROM ${this.tableMap.USERS_TABLE} WHERE username = ${mysql.escape(username)}`;
  }

  public static createJsonWebTokenHashInsertionQuery(userId: number, jsonWebTokenHash: string): string {
    // doesn't need escaping (no direct user input)
    return `INSERT INTO ${this.tableMap.JSON_WEB_TOKEN_TABLE} (json_web_token_id, user_id_fk)
      VALUES (
        ${mysql.escape(jsonWebTokenHash)},
        ${userId})`;
  }

  public static createUserIdSelectionQuery(username: string | null, tag: number | null, email: string | null): string {
    return (
      `SELECT user_id FROM ${this.tableMap.USERS_TABLE} WHERE ` +
      `${[
        `${email ? `email = ${mysql.escape(email)}` : ''}`,
        `${username ? `username = ${mysql.escape(username)}` : ''}`,
        `${tag ? `tag = ${mysql.escape(tag)}` : ''}`,
      ]
        .filter((partial: string) => partial !== '')
        .join(' AND ')}`
    );
  }

  public static createJsonWebTokenRemovalQuery(userId: number): string {
    // doesn't need escaping (no direct user input)
    return `DELETE FROM ${this.tableMap.JSON_WEB_TOKEN_TABLE} WHERE user_id_fk = ${userId}`;
  }

  public static createUserInformationFromJwtHashSelectionQuery(jwtHash: string): string {
    return `SELECT users.username, users.tag, users.email, users.role 
      FROM ${this.tableMap.JSON_WEB_TOKEN_TABLE} 
      INNER JOIN ${
        this.tableMap.USERS_TABLE
      } ON json_web_token.user_id_fk = users.user_id WHERE json_web_token.json_web_token_id = ${mysql.escape(jwtHash)}`;
  }
}
