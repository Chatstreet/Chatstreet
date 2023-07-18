import { HttpResponseType } from './http-response.type';
import { TypeGuardValidationFailure } from '../../utils/type-guards-validation/type-guard-validation-result.type';

export type AsyncHttpResponseType<T> = TypeGuardValidationFailure | HttpResponseType<T>;
