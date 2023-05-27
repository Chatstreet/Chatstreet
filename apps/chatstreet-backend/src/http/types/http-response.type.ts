export type HttpResponseType<T> = HttpResponseSuccess<T> | HttpResponseFailure;

export interface HttpResponseSuccess<T> {
  name: 'http-success';
  data: T;
}

export interface HttpResponseFailure {
  name: 'http-error';
  error: string;
}
