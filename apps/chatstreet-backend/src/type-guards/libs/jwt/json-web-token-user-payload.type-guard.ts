import { z } from 'zod';

export const JsonWebTokenPayloadTypeGuard = z.object({
  jwtHash: z.string(),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export type JsonWebTokenPayloadType = z.infer<typeof JsonWebTokenPayloadTypeGuard>;
