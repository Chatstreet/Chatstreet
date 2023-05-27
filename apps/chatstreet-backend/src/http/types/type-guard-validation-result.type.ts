import { z } from 'zod';

export type TypeGuardValidationResult<T> = TypeGuardValidationSuccess<T> | TypeGuardValidationFailure;

export interface TypeGuardValidationSuccess<T> {
  name: 'validation-success';
  data: T;
}

export interface TypeGuardValidationFailure {
  name: 'validation-error';
  error: z.ZodErrorMap;
}
