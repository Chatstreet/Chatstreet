import mysql from 'mysql';

// TODO: Create unit tests
export default class QueryCreationUtil {
  public static createAuthenticationUserDataSelectionQuery(
    email: string | null,
    username: string | null,
    tag: number | null
  ): string {
    return (
      'SELECT password, email, username, tag, role FROM chatstreet.users WHERE ' +
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
    return (
      'INSERT INTO chatstreet.users (username, tag, first_name, last_name, email, recovery_email, phone_number, birthdate, password)' +
      `VALUES (
        ${mysql.escape(username)}, 
        ${mysql.escape(tag)}, 
        ${mysql.escape(firstName)}, 
        ${mysql.escape(lastName)}, 
        ${mysql.escape(email)}, 
        ${mysql.escape(recoveryEmail)}, 
        ${mysql.escape(phoneNumber)}, 
        ${mysql.escape(birthdate)}, 
        ${mysql.escape(spicyPassword)} )`
    );
  }

  public static createAvailableTagSelectionQuery(username: string): string {
    return `SELECT tag FROM chatstreet.users WHERE username = ${mysql.escape(username)}`;
  }
}
