import { z } from 'zod';

export const AuthenticationResponseTypeGuard = z.object({
  username: z.string(),
  tag: z.number(),
  email: z.string().email(),
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export type AuthenticationResponseType = z.infer<typeof AuthenticationResponseTypeGuard>;
