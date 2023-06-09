import { z } from 'zod';

export const JsonWebTokenUserPayloadTypeGuard = z.object({
  username: z.string(),
  tag: z.number().min(1000).max(9999),
  email: z.string().email(),
});

export type JsonWebTokenUserPayloadType = z.infer<typeof JsonWebTokenUserPayloadTypeGuard>;
