/* eslint-disable @typescript-eslint/no-namespace */

import { AsyncHttpResponseType } from '@app/http/types/async-http-response.type';
import { TypeGuardValidationResult } from '@app/http/types/type-guard-validation-result.type';
import DatabaseOperationsService from '@app/services/database-operations.service';
import { JsonWebTokenUserPayloadType } from '@app/type-guards/libs/jwt/json-web-token-user-payload.type-guard';
import {
  AuthenticationRequestType,
  AuthenticationRequestTypeGuard,
} from '@app/type-guards/libs/token/authentication.request.type-guard';
import { AuthenticationResponseType } from '@app/type-guards/libs/token/authenticaton.response.type-guard';
import JsonWebTokenOperationsUtil from '@app/utils/json-web-token-operations.util';
import { TypeGuardValdiationUtil } from '@app/utils/type-guard-validation.util';
import { Router, Request, Response } from 'express';

const simpleTokenController: Router = Router();
const secureTokenController: Router = Router();

// TODO: Implement swagger documentation
simpleTokenController.post(
  '/auth',
  async (req: Request<unknown>, res: Response<AsyncHttpResponseType<AuthenticationResponseType>>): Promise<void> => {
    // #swagger.tags = ['Authentication']
    // #swagger.description = 'Client authentication via email or username, tag and password.'
    /* #swagger.parameters['Body'] = {
         in: 'body',
         schema: { 
           email: 'example@example.com',
           password: 'password'
         },
         required: 'true'
     } */
    /* #swagger.parameters['Body'] = {
         in: 'body',
         schema: { 
           username: 'Example',
           tag: '1234'
           password: 'password'
         },
         required: 'true'
     } */
    const validationResponse: TypeGuardValidationResult<AuthenticationRequestType> =
      TypeGuardValdiationUtil.validate<AuthenticationRequestType>(AuthenticationRequestTypeGuard, req.body);
    if (validationResponse.name === 'validation-error') {
      res.status(400).json(validationResponse);
      return;
    }
    const validUserInformation: JsonWebTokenUserPayloadType | null =
      await DatabaseOperationsService.getInstance().getValidUserInformation(validationResponse.data);
    if (!validUserInformation) {
      res.status(401).json({
        name: 'http-error',
        error: 'Invalid credentials',
      });
      return;
    }
    const jwtAccessToken: string = JsonWebTokenOperationsUtil.generateAccessToken(validUserInformation);
    res.status(200).json({
      name: 'http-success',
      data: {
        username: validUserInformation.username,
        email: validUserInformation.email,
        tag: validUserInformation.tag,
        token: jwtAccessToken,
      },
    });
  }
);

// validate
// --------
// refresh
// logout

export { simpleTokenController, secureTokenController };
