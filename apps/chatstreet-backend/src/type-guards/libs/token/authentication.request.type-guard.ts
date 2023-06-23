import { z, RefinementCtx } from 'zod';

export const AuthenticationRequestTypeGuard = z
  .object({
    username: z.string(),
    tag: z.string(),
    email: z.string().email(),
    password: z.string(),
  })
  .partial()
  .superRefine((data, ctx: RefinementCtx) => {
    if (!data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message: 'Password is mandatory',
      });
    }
    if (!(data.username && data.tag) && !data.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['username', 'tag'],
        message: 'A username requires a tag',
      });
    }
    if (!data.username && !data.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['username', 'email'],
        message: 'Either an email or a username must be provided',
      });
    }
  });

export type AuthenticationRequestType = z.infer<typeof AuthenticationRequestTypeGuard>;
