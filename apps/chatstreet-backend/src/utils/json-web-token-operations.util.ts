import EnvironmentsConfig from '@app/environments/environments.config';
import { JsonWebTokenUserPayloadType } from '@app/type-guards/libs/jwt/json-web-token-user-payload.type-guard';
import jwt, { SignOptions, VerifyErrors } from 'jsonwebtoken';
import { TokenValidationResponseType } from './types/token-validation-response.type';
import { CookieOptions, Request } from 'express';

const FIFTEEN_MINUTES_IN_MINUTES: number = 60 * 15;
const FIFTEEN_MINUTES_IN_MILLIS = FIFTEEN_MINUTES_IN_MINUTES * 1000;
const ONE_WEEK_IN_MINUTES: number = 60 * 60 * 24 * 7;
const ONE_WEEK_IN_MILLIS = ONE_WEEK_IN_MINUTES * 1000;

export default class JsonWebTokenOperationsUtil {
  private static accessTokenSignOptions: SignOptions = {
    expiresIn: FIFTEEN_MINUTES_IN_MINUTES,
  };
  private static refreshTokenSignOptions: SignOptions = {
    expiresIn: ONE_WEEK_IN_MINUTES,
  };
  private static accessTokenCookieOptions: CookieOptions = {
    httpOnly: false,
    secure: false,
    sameSite: 'strict',
    maxAge: FIFTEEN_MINUTES_IN_MILLIS,
  };
  private static refreshTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: false, // Should be true for https
    sameSite: 'strict',
    maxAge: ONE_WEEK_IN_MILLIS,
  };

  public static generateTokens(user: JsonWebTokenUserPayloadType): string[] {
    const jwtAccessToken: string = this.generateAccessToken(user);
    const jwtRefreshToken: string = this.generateRefreshToken(user);
    return [jwtAccessToken, jwtRefreshToken];
  }

  public static generateAccessToken(user: JsonWebTokenUserPayloadType): string {
    return jwt.sign(user, EnvironmentsConfig.getInstance().getJwtAccessTokenSecret(), this.accessTokenSignOptions);
  }

  private static generateRefreshToken(user: JsonWebTokenUserPayloadType): string {
    return jwt.sign(user, EnvironmentsConfig.getInstance().getJwtRefreshTokenSecret(), this.refreshTokenSignOptions);
  }

  public static async validateAccessToken(
    accessToken: string
  ): Promise<TokenValidationResponseType<JsonWebTokenUserPayloadType>> {
    return this.validateToken<JsonWebTokenUserPayloadType>(
      accessToken,
      EnvironmentsConfig.getInstance().getJwtAccessTokenSecret()
    );
  }

  public static async validateRefreshToken(
    refreshToken: string
  ): Promise<TokenValidationResponseType<JsonWebTokenUserPayloadType>> {
    return this.validateToken<JsonWebTokenUserPayloadType>(
      refreshToken,
      EnvironmentsConfig.getInstance().getJwtRefreshTokenSecret()
    );
  }

  private static async validateToken<T>(token: string, tokenSecret: string): Promise<TokenValidationResponseType<T>> {
    return new Promise<TokenValidationResponseType<T>>(resolve => {
      jwt.verify(token, tokenSecret, (error: VerifyErrors | null, jwt: unknown): void => {
        if (error) {
          // TODO: Implement Logging
          return resolve({
            name: 'validation-error',
            error: error.message,
          });
        }
        return resolve({
          name: 'validation-success',
          data: jwt as T,
        });
      });
    });
  }

  public static getAccessTokenFromRequest(req: Request<unknown>): string | null {
    return req.headers.authorization?.split('Bearer ')[1] ?? null;
  }

  public static getRefreshTokenFromRequest(req: Request<unknown>): string | null {
    return this.getCookieByIdentifier('refreshToken', req.headers.cookie ?? null);
  }

  public static getAccessTokenCookieOptions(): CookieOptions {
    return this.accessTokenCookieOptions;
  }

  public static getRefreshTokenCookieOptions(): CookieOptions {
    return this.refreshTokenCookieOptions;
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
