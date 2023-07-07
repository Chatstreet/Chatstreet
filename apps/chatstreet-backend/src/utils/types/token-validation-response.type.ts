export type TokenValidationResponseType<T> = TokenValidationSuccess<T> | TokenValidationError;

export interface TokenValidationError {
  name: 'validation-error';
  error: string;
}

export interface TokenValidationSuccess<T> {
  name: 'validation-success';
  data: T;
}
