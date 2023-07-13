import { z } from 'zod';
import { AuthenticationResponseTypeGuard } from './authenticaton.response.type-guard';

export const VerificationResponseTypeGuard = z.discriminatedUnion('status', [
  z.object({ status: z.literal('success'), data: AuthenticationResponseTypeGuard }),
  z.object({ status: z.literal('error'), error: z.string() }),
]);

export type VerificationResponseType = z.infer<typeof VerificationResponseTypeGuard>;
