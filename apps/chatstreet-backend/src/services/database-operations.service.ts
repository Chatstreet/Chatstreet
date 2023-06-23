import EnvironmentsConfig from '@app/environments/environments.config';
import { JsonWebTokenUserPayloadType } from '@app/type-guards/libs/jwt/json-web-token-user-payload.type-guard';
import { AuthenticationRequestType } from '@app/type-guards/libs/token/authentication.request.type-guard';
import LoggerWrapperUtil from '@app/utils/logger-wrapper.util';
import mysql, { Connection, MysqlError } from 'mysql';
import { AuthenticationUserDataDatabaseResponse } from './database-operations.types';
import DatabaseEncriptionUtil from '@app/utils/database-encription.util';
import QueryCreationUtil from '@app/utils/query-creation.util';

// REMEMBER TO UPATE MOCK ON IMPLEMENTATION OF NEW FEATURES
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
    const databaseResponse: AuthenticationUserDataDatabaseResponse | null =
      await this.executeQuery<AuthenticationUserDataDatabaseResponse>(queryString)
        .then((response: AuthenticationUserDataDatabaseResponse | null) => response)
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

  private async executeQuery<T>(queryString: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      this.connection.query(queryString, (error: MysqlError | null, results: T[]): void => {
        if (error) {
          reject(error.message);
          return;
        }
        const databaseResponse: T | null = results.pop() ?? null;
        if (!databaseResponse) {
          resolve(null);
          return;
        }
        resolve(databaseResponse);
      });
    });
  }

  // Getter
  public getConnection(): Connection {
    return this.connection;
  }
}
