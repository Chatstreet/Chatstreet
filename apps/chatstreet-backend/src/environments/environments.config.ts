import dotenv from 'dotenv';

export default class EnvironmentsConfig {
  private readonly port: string;
  private readonly host: string;
  private static instance: EnvironmentsConfig | null = null;

  private constructor(environment: string) {
    dotenv.config();
    switch (environment) {
      case 'development': {
        this.port = process.env.DEVELOPMENT_PORT ?? '';
        this.host = process.env.DEVELOPMENT_HOST ?? '';
        break;
      }
      case 'production': {
        this.port = process.env.PRODUCTION_PORT ?? '';
        this.host = process.env.PRODUCTION_HOST ?? '';
        break;
      }
      default: {
        this.port = process.env.PRODUCTION_PORT ?? '';
        this.host = process.env.PRODUCTION_HOST ?? '';
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

  public getPort(): string {
    return this.port;
  }

  public getHost(): string {
    return this.host;
  }
}
