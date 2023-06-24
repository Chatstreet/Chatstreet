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

simpleTokenController.post(
  '/auth',
  async (req: Request<unknown>, res: Response<AsyncHttpResponseType<AuthenticationResponseType>>): Promise<void> => {
    // #swagger.tags = ['Authentication']
    // #swagger.description = 'Client authentication via email or username, tag and password.'
    /* #swagger.parameters['Username & tag authentication'] = {
          in: 'body',
          required: true,
          schema: { $ref: '#/definitions/PostAuthRequestUsernameTag' },
        }, */
    /* #swagger.parameters['Email authentiaction'] = {
          in: 'body',
          required: true,
          schema: { $ref: '#/definitions/PostAuthRequestEmail' },
        }, */
    /* #swagger.responses[200] = {
          description: 'Successfully logged in. Client can now access secure endpoints.',
          schema: { $ref: '#/definitions/PostAuthResponseSuccess' },
        } */
    /* #swagger.responses[400] = {
          description: 'Bad Request, check your json request body.',
          schema: { $ref: '#/definitions/PostAuthResponseBadRequest' },
        } */
    /* #swagger.responses[401] = {
          description: 'The credentials of your request are unknown to the server.',
          schema: { $ref: '#/definitions/PostAuthResponseUnauthorized' },
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

export default simpleTokenController;
