import EnvironmentsConfig from '@app/environments/environments.config';
import { JsonWebTokenUserPayloadType } from '@app/type-guards/libs/jwt/json-web-token-user-payload.type-guard';
import { AuthenticationRequestType } from '@app/type-guards/libs/token/authentication.request.type-guard';
import LoggerWrapperUtil from '@app/utils/logger-wrapper.util';
import mysql, { Connection, MysqlError } from 'mysql';
import { AuthenticationUserDataDatabaseResponse, AvailableTagDatabaseResponse } from './database-operations.types';
import DatabaseEncriptionUtil from '@app/utils/database-encription.util';
import QueryCreationUtil from '@app/utils/query-creation.util';
import { RegistrationRequestType } from '@app/type-guards/libs/token/registration.request.type-guard';
import { RegistrationResponseType } from '@app/type-guards/libs/token/registration.response.type-guard';

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

  public async getValidUserInformation(
    userData: AuthenticationRequestType
  ): Promise<JsonWebTokenUserPayloadType | null> {
    const queryString: string = QueryCreationUtil.createAuthenticationUserDataSelectionQuery(
      userData.email ?? null,
      userData.username ?? null,
      parseInt(userData.tag ? userData.tag : '')
    );
    LoggerWrapperUtil.info(`Executing query: "${queryString}"`, DatabaseOperationsService);
    const databaseResponse: AuthenticationUserDataDatabaseResponse | null = await this.executeQuery<
      AuthenticationUserDataDatabaseResponse[]
    >(queryString)
      .then((response: AuthenticationUserDataDatabaseResponse[] | null) => response?.pop() ?? null)
      .catch((error: string) => {
        LoggerWrapperUtil.error(error, DatabaseOperationsService);
        return null;
      });
    if (!databaseResponse) {
      return null;
    }
    const passwordIsValid: boolean = await DatabaseEncriptionUtil.compare(
      userData.password ?? '',
      databaseResponse.password
    ).then((result: boolean) => result);
    if (passwordIsValid) {
      return {
        username: databaseResponse.username,
        tag: databaseResponse.tag,
        email: databaseResponse.email,
      };
    }
    return null;
  }

  public async registerUser(userData: RegistrationRequestType): Promise<RegistrationResponseType | string> {
    const spicyPassword: string = await DatabaseEncriptionUtil.encrypt(userData.password);
    const availableTag: number | null = await this.getGeneratedTag(userData.username);
    if (!availableTag) {
      return 'Username limit reached';
    }
    const queryString: string = QueryCreationUtil.createRegistrationUserDataInsertionQuery(
      userData.username,
      availableTag,
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.recoveryEmail ?? null,
      userData.phoneNumber ?? null,
      userData.birthdate ?? null,
      spicyPassword
    );
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
    return await this.executeQuery<AvailableTagDatabaseResponse[]>(queryString)
      .then((response: AvailableTagDatabaseResponse[] | null) => response)
      .catch((error: string) => {
        LoggerWrapperUtil.error(error, DatabaseOperationsService);
        return null;
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
