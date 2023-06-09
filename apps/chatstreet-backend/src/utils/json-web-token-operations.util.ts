import EnvironmentsConfig from '@app/environments/environments.config';
import { JsonWebTokenUserPayloadType } from '@app/type-guards/libs/jwt/json-web-token-user-payload.type-guard';
import jwt, { SignOptions, VerifyErrors } from 'jsonwebtoken';
import { TokenValidationResponseType } from './types/token-validation-response.type';

const ONE_WEEK: number = 60 * 60 * 24 * 7;

export default class JsonWebTokenOperationsUtil {
  private static signOptions: SignOptions = {
    expiresIn: ONE_WEEK,
  };

  public static generateAccessToken(user: JsonWebTokenUserPayloadType): string {
    return jwt.sign(user, EnvironmentsConfig.getInstance().getJwtSecret(), this.signOptions);
  }

  public static async validateToken(token: string): Promise<TokenValidationResponseType> {
    return new Promise<TokenValidationResponseType>(resolve => {
      jwt.verify(
        token,
        EnvironmentsConfig.getInstance().getJwtSecret(),
        (error: VerifyErrors | null, jwt: unknown): void => {
          if (error) {
            // TODO: Implement Logging
            return resolve({
              name: 'validation-error',
              error: error.message,
            });
          }
          return resolve({
            name: 'validation-success',
            data: jwt as JsonWebTokenUserPayloadType,
          });
        }
      );
    });
  }
}
