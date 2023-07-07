import { z } from 'zod';

export const RefreshResponseTypeGuard = z.object({
  username: z.string(),
  tag: z.number().min(1000).max(9999),
  email: z.string().email(),
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']),
});

export type RefreshResponseType = z.infer<typeof RefreshResponseTypeGuard>;
