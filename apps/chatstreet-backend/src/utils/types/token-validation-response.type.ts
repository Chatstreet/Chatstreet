import { JsonWebTokenUserPayloadType } from '@app/type-guards/libs/jwt/json-web-token-user-payload.type-guard';

export type TokenValidationResponseType = TokenValidationSuccess | TokenValidationError;

export interface TokenValidationError {
  name: 'validation-error';
  error: string;
}

export interface TokenValidationSuccess {
  name: 'validation-success';
  data: JsonWebTokenUserPayloadType;
}
