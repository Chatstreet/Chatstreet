import EnvironmentsConfig from '@app/environments/environments.config';
import mysql, { Connection } from 'mysql';

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

  // Getter
  public getConnection(): Connection {
    return this.connection;
  }
}
