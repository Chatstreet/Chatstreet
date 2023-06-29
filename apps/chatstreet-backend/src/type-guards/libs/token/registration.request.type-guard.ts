import { z } from 'zod';
import validator from 'validator';

export const RegistrationRequestTypeGuard = z.object({
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  recoveryEmail: z.string().email().optional(),
  phoneNumber: z.string().refine(validator.isMobilePhone).optional(),
  birthdate: z.coerce.date().optional(),
  password: z.string(),
});

export type RegistrationRequestType = z.infer<typeof RegistrationRequestTypeGuard>;
