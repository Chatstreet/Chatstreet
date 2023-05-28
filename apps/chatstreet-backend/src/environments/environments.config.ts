import dotenv from 'dotenv';

export default class EnvironmentsConfig {
  private readonly port: string;
  private readonly host: string;
  private readonly databaseHost: string;
  private readonly databaseUser: string;
  private readonly databasePassword: string;
  private readonly databaseName: string;
  private static instance: EnvironmentsConfig | null = null;

  private constructor(environment: string) {
    dotenv.config();
    switch (environment) {
      case 'development': {
        this.port = process.env.DEVELOPMENT_PORT ?? '';
        this.host = process.env.DEVELOPMENT_HOST ?? '';
        this.databaseHost = process.env.DEVELOPMENT_DATABASE_HOST ?? '';
        this.databaseUser = process.env.DEVELOPMENT_DATABASE_USER ?? '';
        this.databasePassword = process.env.DEVELOPMENT_DATABASE_PASSWORD ?? '';
        this.databaseName = process.env.DEVELOPMENT_DATABASE_NAME ?? '';
        break;
      }
      case 'production': {
        this.port = process.env.PRODUCTION_PORT ?? '';
        this.host = process.env.PRODUCTION_HOST ?? '';
        this.databaseHost = process.env.PRODUCTION_DATABASE_HOST ?? '';
        this.databaseUser = process.env.PRODUCTION_DATABASE_USER ?? '';
        this.databasePassword = process.env.PRODUCTION_DATABASE_PASSWORD ?? '';
        this.databaseName = process.env.PRODUCTION_DATABASE_NAME ?? '';
        break;
      }
      default: {
        this.port = process.env.PRODUCTION_PORT ?? '';
        this.host = process.env.PRODUCTION_HOST ?? '';
        this.databaseHost = process.env.PRODUCTION_DATABASE_HOST ?? '';
        this.databaseUser = process.env.PRODUCTION_DATABASE_USER ?? '';
        this.databasePassword = process.env.PRODUCTION_DATABASE_PASSWORD ?? '';
        this.databaseName = process.env.PRODUCTION_DATABASE_NAME ?? '';
        break;
      }
    }
  }

  public static getInstance(): EnvironmentsConfig {
    if (!EnvironmentsConfig.instance) {
      const env: string = process.env.NODE_ENV ?? 'production';
      EnvironmentsConfig.instance = new EnvironmentsConfig(env.trim());
    }
    return EnvironmentsConfig.instance;
  }

  // Getters
  public getPort(): string {
    return this.port;
  }

  public getHost(): string {
    return this.host;
  }

  public getDatabaseHost(): string {
    return this.databaseHost;
  }

  public getDatabaseUser(): string {
    return this.databaseUser;
  }

  public getDatabasePassword(): string {
    return this.databasePassword;
  }

  public getDatabaseName(): string {
    return this.databaseName;
  }
}
