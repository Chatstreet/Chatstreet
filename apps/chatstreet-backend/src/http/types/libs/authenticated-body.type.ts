import { JsonWebTokenPayloadType } from '@app/type-guards/libs/jwt/json-web-token-user-payload.type-guard';

export type AuthenticatedBodyType = {
  user: JsonWebTokenPayloadType;
};
