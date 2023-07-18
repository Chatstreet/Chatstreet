import { JsonWebTokenPayloadType } from '@app/type-guards/libs/json-web-token/json-web-token-user-payload.type-guard';

export type AuthenticatedBodyType = {
  jwtHash: JsonWebTokenPayloadType;
};
