import { HttpResponseFailure, HttpResponseType } from '@app/http/types/http-response.type';
import { AuthenticatedBodyType } from '@app/http/types/libs/authenticated-body.type';
import JsonWebTokenOperationsUtil from '@app/utils/json-web-token-operations.util';
import { TokenValidationResponseType } from '@app/utils/types/token-validation-response.type';
import { NextFunction, Request, Response } from 'express';

const secureEndpointsMiddleware = async (
  req: Request<unknown, unknown, AuthenticatedBodyType>,
  res: Response<HttpResponseType<unknown>>,
  next: NextFunction
): Promise<void> => {
  const authHeader: string | null = req.headers['authorization'] ?? null;
  const token: string | null = authHeader && authHeader?.split(' ')[1];
  if (!token) {
    res.status(401).json({
      name: 'http-error',
      error: 'Unauthorized, missing authorization headers',
    });
    return;
  }
  await JsonWebTokenOperationsUtil.validateToken(token).then(
    (tokenValidationResponse: TokenValidationResponseType): Response<HttpResponseFailure> | void => {
      if (tokenValidationResponse.name === 'validation-error') {
        return res.status(401).json({
          name: 'http-error',
          error: 'Unauthorized, invalid token',
        });
      }
      req.body.user = tokenValidationResponse.data;
      return next();
    }
  );
};

export default secureEndpointsMiddleware;
