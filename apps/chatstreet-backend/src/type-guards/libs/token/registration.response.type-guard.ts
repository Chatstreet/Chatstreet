import { z } from 'zod';
import validator from 'validator';

export const RegistrationResponseTypeGuard = z.object({
  username: z.string(),
  tag: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  recoveryEmail: z.string().email().optional(),
  phoneNumber: z.string().refine(validator.isMobilePhone).optional(),
  birthdate: z.coerce.date().optional(),
});

export type RegistrationResponseType = z.infer<typeof RegistrationResponseTypeGuard>;
