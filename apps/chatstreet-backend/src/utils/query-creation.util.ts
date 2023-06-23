import mysql from 'mysql';

export default class QueryCreationUtil {
  public static createAuthenticationUserDataSelectionQuery(
    email: string | null,
    username: string | null,
    tag: number | null
  ): string {
    return (
      'SELECT password, email, username, tag FROM chatstreet.users WHERE ' +
      `${[
        `${email ? `email = ${mysql.escape(email)}` : ''}`,
        `${username ? `username = ${mysql.escape(username)}` : ''}`,
        `${tag ? `tag = ${mysql.escape(tag)}` : ''}`,
      ]
        .filter((partial: string) => partial !== '')
        .join(' AND ')}`
    );
  }
}
