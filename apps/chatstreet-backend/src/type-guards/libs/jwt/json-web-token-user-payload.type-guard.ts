import { z } from 'zod';

export const JsonWebTokenUserPayloadTypeGuard = z.object({
  username: z.string(),
  tag: z.number().min(1000).max(9999),
  email: z.string().email(),
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export type JsonWebTokenUserPayloadType = z.infer<typeof JsonWebTokenUserPayloadTypeGuard>;
