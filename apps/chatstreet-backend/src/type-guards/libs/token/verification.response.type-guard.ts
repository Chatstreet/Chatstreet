import { z } from 'zod';
import { JsonWebTokenUserPayloadTypeGuard } from '../jwt/json-web-token-user-payload.type-guard';

export const VerificationResponseTypeGuard = z.discriminatedUnion('status', [
  z.object({ status: z.literal('success'), data: JsonWebTokenUserPayloadTypeGuard }),
  z.object({ status: z.literal('error'), error: z.string() }),
]);

export type VerificationResponseType = z.infer<typeof VerificationResponseTypeGuard>;
