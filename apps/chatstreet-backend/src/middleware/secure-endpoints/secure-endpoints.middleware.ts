import { HttpResponseFailure, HttpResponseType } from '@app/http/types/http-response.type';
import { JsonWebTokenPayloadType } from '@app/type-guards/libs/json-web-token/json-web-token-user-payload.type-guard';
import JsonWebTokenOperationsUtil from '@app/utils/json-web-token-operations/json-web-token-operations.util';
import { TokenValidationResponseType } from '@app/utils/json-web-token-operations/token-validation-response.type';
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
      tokenValidationResponse: TokenValidationResponseType<JsonWebTokenPayloadType>
    ): Response<HttpResponseFailure> | void => {
      if (tokenValidationResponse.name === 'validation-error') {
        return res.status(401).json({
          name: 'http-error',
          error: 'Unauthorized, invalid token',
        });
      }
      req.body.jwtHash = tokenValidationResponse.data.jwtHash;
      return next();
    }
  );
};

export default secureEndpointsMiddleware;