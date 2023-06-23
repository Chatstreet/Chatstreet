import { z } from 'zod';

export const AuthenticationResponseTypeGuard = z.object({
  username: z.string(),
  email: z.string().email(),
  token: z.string(),
});

export type AuthenticationResponseType = z.infer<typeof AuthenticationResponseTypeGuard>;
