import EnvironmentsConfig from '@app/environments/environments.config';
import { JsonWebTokenUserPayloadType } from '@app/type-guards/libs/jwt/json-web-token-user-payload.type-guard';
import jwt, { SignOptions, VerifyErrors } from 'jsonwebtoken';
import { TokenValidationResponseType } from './types/token-validation-response.type';
import { Request } from 'express';

const FIFTEEN_MINUTES: number = 60 * 15;
const ONE_WEEK: number = 60 * 60 * 24 * 7;

export default class JsonWebTokenOperationsUtil {
  private static accessTokenSignOptions: SignOptions = {
    expiresIn: FIFTEEN_MINUTES,
  };
  private static refreshTokenSignOptions: SignOptions = {
    expiresIn: ONE_WEEK,
  };

  public static generateTokens(user: JsonWebTokenUserPayloadType): string[] {
    const jwtAccessToken: string = jwt.sign(
      user,
      EnvironmentsConfig.getInstance().getJwtAccessTokenSecret(),
      this.accessTokenSignOptions
    );
    const jwtRefreshToken: string = jwt.sign(
      {},
      EnvironmentsConfig.getInstance().getJwtRefreshTokenSecret(),
      this.refreshTokenSignOptions
    );
    return [jwtAccessToken, jwtRefreshToken];
  }

  public static async validateAccessToken(accessToken: string): Promise<TokenValidationResponseType> {
    return new Promise<TokenValidationResponseType>(resolve => {
      jwt.verify(
        accessToken,
        EnvironmentsConfig.getInstance().getJwtAccessTokenSecret(),
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

  public static getAccessTokenFromRequest(req: Request<unknown>): string | null {
    return req.headers.authorization?.split('Bearer ')[1] ?? null;
  }

  public static getRefreshTokenFromRequest(req: Request<unknown>): string | null {
    return this.getCookieByIdentifier('refreshToken', req.headers.cookie ?? null);
  }

  private static getCookieByIdentifier(identifier: string, cookieHeader: string | null): string | null {
    if (!cookieHeader) {
      return null;
    }
    const cookies: string[] = cookieHeader.split(';');
    const identifiedCookie: string | null =
      cookies.find((cookie: string) => cookie.trim().startsWith(identifier)) ?? null;
    return identifiedCookie?.split('=')[1] ?? null;
  }
}
