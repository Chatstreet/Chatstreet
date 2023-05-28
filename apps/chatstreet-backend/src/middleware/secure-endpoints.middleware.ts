import { HttpResponseType } from '@app/http/types/http-response.type';
import { NextFunction, Request, Response } from 'express';

const secureEndpointsMiddleware = (
  req: Request<unknown>,
  res: Response<HttpResponseType<unknown>>,
  next: NextFunction
): void => {
  // TODO: Implement security check
  next();
};

export default secureEndpointsMiddleware;
