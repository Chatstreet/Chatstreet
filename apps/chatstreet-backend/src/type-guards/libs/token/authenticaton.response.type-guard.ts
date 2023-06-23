import { z } from 'zod';

export const AuthenticationResponseTypeGuard = z.object({
  username: z.string(),
  tag: z.number(),
  email: z.string().email(),
  token: z.string(),
});

export type AuthenticationResponseType = z.infer<typeof AuthenticationResponseTypeGuard>;
