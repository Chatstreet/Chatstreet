import EnvironmentsConfig from '@app/environments/environments.config';
import logger from 'npmlog';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Class = { name: string };

export default class LoggerWrapperUtil {
  public static info(message: string, clazz: Class): void {
    logger.info(`[${this.camelCaseToKebabCase(clazz.name)}] [${this.getCurrentTimestampFormatted()}]`, message);
  }

  public static error(message: string, clazz: Class): void {
    logger.error(`[${this.camelCaseToKebabCase(clazz.name)}] [${this.getCurrentTimestampFormatted()}]`, message);
  }

  public static debugg(message: string, clazz: Class): void {
    if (EnvironmentsConfig.getInstance().getEnvironment() !== 'development') {
      return;
    }
    this.info(message, clazz);
  }

  private static getCurrentTimestampFormatted(): string {
    return `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`;
  }

  private static camelCaseToKebabCase(name: string): string {
    return name.replace(/[A-Z]/g, (letter: string) => `-${letter.toLocaleLowerCase()}`).replace(/^./, '');
  }
}