import EnvironmentsConfig from '@app/environments/environments.config';
import { AuthenticationRequestType } from '@app/type-guards/libs/token/authentication.request.type-guard';
import LoggerWrapperUtil from '@app/utils/logger-wrapper/logger-wrapper.util';
import mysql, { Connection, MysqlError } from 'mysql';
import {
  AuthenticationUserDataDatabaseResponse,
  AvailableTagDatabaseResponse,
  RemovalDatabaseResponse,
  UserIdDatabaseResponse,
} from './database-operations.types';
import DatabaseEncriptionUtil from '@app/utils/database-encription/database-encription.util';
import QueryCreationUtil from '@app/utils/query-creation/query-creation.util';
import { RegistrationRequestType } from '@app/type-guards/libs/token/registration.request.type-guard';
import { RegistrationResponseType } from '@app/type-guards/libs/token/registration.response.type-guard';
import { v4 as uuid } from 'uuid';
import { AuthenticationResponseType } from '@app/type-guards/libs/token/authenticaton.response.type-guard';

// REMEMBER TO UPATE MOCK ON IMPLEMENTATION OF NEW PUBLIC METHODS
export default class DatabaseOperationsService {
  private static instance: DatabaseOperationsService | null = null;
  private readonly connection: Connection;

  private constructor() {
    this.connection = mysql.createConnection({
      host: EnvironmentsConfig.getInstance().getDatabaseHost(),
      user: EnvironmentsConfig.getInstance().getDatabaseUser(),
      password: EnvironmentsConfig.getInstance().getDatabasePassword(),
      database: EnvironmentsConfig.getInstance().getDatabaseName(),
    });
  }

  public static getInstance(): DatabaseOperationsService {
    if (!this.instance) {
      this.instance = new DatabaseOperationsService();
    }
    return this.instance;
  }

  public async validateUserCredentials(userData: AuthenticationRequestType): Promise<boolean> {
    const queryString: string | null = QueryCreationUtil.createAuthenticationUserDataSelectionQuery({
      email: userData.email ?? null,
      username: userData.username ?? null,
      tag: parseInt(userData.tag ? userData.tag : ''),
    });
    if (!queryString) {
      return false;
    }
    LoggerWrapperUtil.debugg(`Executing query: "${queryString}"`, DatabaseOperationsService);
    const databaseResponse: AuthenticationUserDataDatabaseResponse | null = await this.executeQuery<
      AuthenticationUserDataDatabaseResponse[]
    >(queryString)
      .then((response: AuthenticationUserDataDatabaseResponse[] | null) => response?.pop() ?? null)
      .catch((error: string) => {
        LoggerWrapperUtil.error(error, DatabaseOperationsService);
        return null;
      });
    if (!databaseResponse) {
      return false;
    }
    const passwordIsValid: boolean = await DatabaseEncriptionUtil.compare(
      userData.password ?? '',
      databaseResponse.password
    ).then((result: boolean) => result);
    return passwordIsValid;
  }

  public async registerUser(userData: RegistrationRequestType): Promise<RegistrationResponseType | string> {
    const spicyPassword: string = await DatabaseEncriptionUtil.encrypt(userData.password);
    const availableTag: number | null = await this.getGeneratedTag(userData.username);
    if (!availableTag) {
      return 'Username limit reached';
    }
    const queryString: string = QueryCreationUtil.createRegistrationUserDataInsertionQuery({
      ...userData,
      recoveryEmail: userData.recoveryEmail ?? null,
      phoneNumber: userData.phoneNumber ?? null,
      birthdate: userData.birthdate ?? null,
      tag: availableTag,
      spicyPassword,
    });
    LoggerWrapperUtil.debugg(`Executing query: "${queryString}"`, DatabaseOperationsService);
    const databaseResponse: string | unknown = await this.executeQuery<unknown>(queryString)
      .then((response: unknown) => response)
      .catch((error: string) => {
        LoggerWrapperUtil.error(error, DatabaseOperationsService);
        return error;
      });
    if (typeof databaseResponse === 'string') {
      return databaseResponse;
    }
    return {
      username: userData.username,
      tag: availableTag,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      recoveryEmail: userData.recoveryEmail,
      phoneNumber: userData.phoneNumber,
      birthdate: userData.birthdate,
    };
  }

  public async getJsonWebTokenHash(userData: AuthenticationRequestType): Promise<string | null> {
    const userId: number | null = await this.getUserId(userData);
    if (!userId) {
      return null;
    }
    await this.removeJsonWebToken(userId);
    const jsonWebTokenHash: string = uuid();
    const queryString: string = QueryCreationUtil.createJsonWebTokenHashInsertionQuery({ userId, jsonWebTokenHash });
    LoggerWrapperUtil.debugg(`Executing query: "${queryString}"`, DatabaseOperationsService);
    const databaseResponse: string | unknown = await this.executeQuery<unknown>(queryString)
      .then((response: unknown) => response)
      .catch((error: string) => {
        LoggerWrapperUtil.error(error, DatabaseOperationsService);
        return error;
      });
    if (typeof databaseResponse === 'string') {
      return null;
    }
    return jsonWebTokenHash;
  }

  public async getUserInformationFromJwtHash(jwtHash: string): Promise<AuthenticationResponseType | null> {
    const queryString: string = QueryCreationUtil.createUserInformationFromJwtHashSelectionQuery(jwtHash);
    return await this.executeQuery<AuthenticationResponseType[] | null>(queryString)
      .then((response: AuthenticationResponseType[] | null) => (response ? response[0] : null))
      .catch((error: string) => {
        LoggerWrapperUtil.error(error, DatabaseOperationsService);
        return null;
      });
  }

  private async getGeneratedTag(username: string): Promise<number | null> {
    const availableTags: AvailableTagDatabaseResponse[] | null = await this.getAvailableTag(username);
    // random number between 1000 and 9999
    let randomTag: number = Math.floor(Math.random() * 9000 + 1000);
    const triedTags: number[] = [];
    if (!availableTags) {
      return randomTag;
    }
    for (let tagCounter = 0; tagCounter < 8999; tagCounter++) {
      triedTags.push(randomTag);
      const tagIsTaken: boolean = availableTags.some(
        (wrappedTag: AvailableTagDatabaseResponse) => wrappedTag.tag === randomTag
      );
      if (!tagIsTaken) {
        return randomTag;
      }
      while (triedTags.some((triedTag: number) => triedTag === randomTag)) {
        randomTag = Math.floor(Math.random() * 9000 + 1000);
      }
    }
    return null;
  }

  private async getAvailableTag(username: string): Promise<AvailableTagDatabaseResponse[] | null> {
    const queryString: string = QueryCreationUtil.createAvailableTagSelectionQuery(username);
    LoggerWrapperUtil.debugg(`Executing query: "${queryString}"`, DatabaseOperationsService);
    return await this.executeQuery<AvailableTagDatabaseResponse[]>(queryString)
      .then((response: AvailableTagDatabaseResponse[] | null) => response)
      .catch((error: string) => {
        LoggerWrapperUtil.error(error, DatabaseOperationsService);
        return null;
      });
  }

  private async getUserId(userData: AuthenticationRequestType): Promise<number | null> {
    const queryString: string | null = QueryCreationUtil.createUserIdSelectionQuery({
      username: userData.username ?? null,
      tag: parseInt(userData.tag ? userData.tag : ''),
      email: userData.email ?? null,
    });
    if (!queryString) {
      return null;
    }
    LoggerWrapperUtil.debugg(`Executing query: "${queryString}"`, DatabaseOperationsService);
    return await this.executeQuery<UserIdDatabaseResponse[]>(queryString)
      .then((response: UserIdDatabaseResponse[] | null) => (response ? response[0].user_id : null))
      .catch((error: string) => {
        LoggerWrapperUtil.error(error, DatabaseOperationsService);
        return null;
      });
  }

  private async removeJsonWebToken(userId: number): Promise<boolean> {
    const queryString: string = QueryCreationUtil.createJsonWebTokenRemovalQuery(userId);
    LoggerWrapperUtil.debugg(`Executing query: "${queryString}"`, DatabaseOperationsService);
    return await this.executeQuery<RemovalDatabaseResponse>(queryString)
      .then((response: RemovalDatabaseResponse | null) => (response ? response.affectedRows > 0 : false))
      .catch((error: string) => {
        LoggerWrapperUtil.error(error, DatabaseOperationsService);
        return false;
      });
  }

  private async executeQuery<T>(queryString: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      this.connection.query(queryString, (error: MysqlError | null, results: T): void => {
        if (error) {
          reject(error.message);
          return;
        }
        resolve(results);
      });
    });
  }

  // Getter
  public getConnection(): Connection {
    return this.connection;
  }
}
