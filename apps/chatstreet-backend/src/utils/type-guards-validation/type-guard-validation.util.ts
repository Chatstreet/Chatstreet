import { z, SafeParseReturnType } from 'zod';
import { TypeGuardValidationResult } from './type-guard-validation-result.type';

export class TypeGuardValdiationUtil {
  public static validate<responseType>(typeGuard: z.Schema, input: unknown): TypeGuardValidationResult<responseType> {
    const validationResult: SafeParseReturnType<responseType, responseType> = typeGuard.safeParse(input);
    if (!validationResult.success) {
      return {
        name: 'validation-error',
        error: validationResult.error,
        data: input,
      };
    }
    return {
      name: 'validation-success',
      data: validationResult.data,
    };
  }
}
