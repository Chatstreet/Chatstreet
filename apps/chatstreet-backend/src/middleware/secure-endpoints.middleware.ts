import { HttpResponseFailure, HttpResponseType } from '@app/http/types/http-response.type';
import { JsonWebTokenUserPayloadType } from '@app/type-guards/libs/jwt/json-web-token-user-payload.type-guard';
import JsonWebTokenOperationsUtil from '@app/utils/json-web-token-operations.util';
import { TokenValidationResponseType } from '@app/utils/types/token-validation-response.type';
import { NextFunction, Request, Response } from 'express';

const secureEndpointsMiddleware = async (
  req: Request<unknown>,
  res: Response<HttpResponseType<unknown>>,
  next: NextFunction
): Promise<void> => {
  const accessToken: string | null = JsonWebTokenOperationsUtil.getAccessTokenFromRequest(req);
  if (!accessToken) {
    res.status(401).json({
      name: 'http-error',
      error: 'Unauthorized, missing authorization headers',
    });
    return;
  }
  await JsonWebTokenOperationsUtil.validateAccessToken(accessToken).then(
    (
      tokenValidationResponse: TokenValidationResponseType<JsonWebTokenUserPayloadType>
    ): Response<HttpResponseFailure> | void => {
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
