import { AsyncHttpResponseType } from '@app/http/types/async-http-response.type';
import { HttpResponseFailure } from '@app/http/types/http-response.type';
import { AuthenticatedBodyType } from '@app/http/types/libs/authenticated-body.type';
import { TypeGuardValidationResult } from '@app/http/types/type-guard-validation-result.type';
import DatabaseOperationsService from '@app/services/database-operations.service';
import { JsonWebTokenUserPayloadType } from '@app/type-guards/libs/jwt/json-web-token-user-payload.type-guard';
import {
  AuthenticationRequestType,
  AuthenticationRequestTypeGuard,
} from '@app/type-guards/libs/token/authentication.request.type-guard';
import { AuthenticationResponseType } from '@app/type-guards/libs/token/authenticaton.response.type-guard';
import {
  RegistrationRequestType,
  RegistrationRequestTypeGuard,
} from '@app/type-guards/libs/token/registration.request.type-guard';
import { RegistrationResponseType } from '@app/type-guards/libs/token/registration.response.type-guard';
import { VerificationResponseType } from '@app/type-guards/libs/token/verification.response.type-guard';
import JsonWebTokenOperationsUtil from '@app/utils/json-web-token-operations.util';
import { TypeGuardValdiationUtil } from '@app/utils/type-guard-validation.util';
import { TokenValidationResponseType } from '@app/utils/types/token-validation-response.type';
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
    const ONE_WEEK = 604800000;
    const FIFTEEN_MINUTES = 900000;
    const validationResponse: TypeGuardValidationResult<AuthenticationRequestType> =
      TypeGuardValdiationUtil.validate<AuthenticationRequestType>(AuthenticationRequestTypeGuard, req.body);
    if (validationResponse.name === 'validation-error') {
      res.status(400).json({
        name: 'validation-error',
        error: validationResponse.error,
        data: validationResponse.data,
      });
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
    const jwtTokens: string[] = JsonWebTokenOperationsUtil.generateTokens(validUserInformation);
    res
      .status(200)
      .cookie('refreshToken', jwtTokens[1], {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: ONE_WEEK,
      })
      .cookie('accessToken', jwtTokens[0], {
        httpOnly: false,
        secure: false,
        sameSite: 'strict',
        maxAge: FIFTEEN_MINUTES,
      })
      .json({
        name: 'http-success',
        data: {
          username: validUserInformation.username,
          email: validUserInformation.email,
          tag: validUserInformation.tag,
        },
      });
  }
);

simpleTokenController.get(
  '/verify',
  async (
    req: Request<unknown, unknown, AuthenticatedBodyType>,
    res: Response<AsyncHttpResponseType<VerificationResponseType>>
  ): Promise<void> => {
    // #swagger.tags = ['Authentication']
    // #swagger.description = 'Used to determine wether the user is still authenticated.'
    /* #swagger.responses[200 - Valid] = {
          description: 'The token provided by the request hearder is valid.',
          schema: { $ref: '#/definitions/GetAuthResponseSuccess' },
        } */
    /* #swagger.responses[200 - No Token] = {
          description: 'The client does not provide a token in the authorization header.',
          schema: { $ref: '#/definitions/GetVerifyResponseSuccessNoToken' },
        } */
    /* #swagger.responses[200 - Invalid] = {
          description: 'The token provided by the request header is invalid.',
          schema: { $ref: '#/definitions/GetVerifyResponseSuccessInvalidToken' },
        } */
    const accessToken: string | null = JsonWebTokenOperationsUtil.getAccessTokenFromRequest(req);
    if (!accessToken) {
      res.status(200).json({
        name: 'http-success',
        data: {
          status: 'error',
          error: 'No token provided',
        },
      });
      return;
    }
    await JsonWebTokenOperationsUtil.validateAccessToken(accessToken).then(
      (tokenValidationResponse: TokenValidationResponseType): Response<HttpResponseFailure> => {
        if (tokenValidationResponse.name === 'validation-error') {
          return res.status(200).json({
            name: 'http-success',
            data: {
              status: 'error',
              error: 'Token is invalid',
            },
          });
        }
        return res.status(200).json({
          name: 'http-success',
          data: {
            status: 'success',
            data: tokenValidationResponse.data,
          },
        });
      }
    );
  }
);

simpleTokenController.post(
  '/register',
  async (req: Request<unknown>, res: Response<AsyncHttpResponseType<RegistrationResponseType>>): Promise<void> => {
    // #swagger.tags = ['Authentication']
    // #swagger.description = 'Used to create a new account for a user.'
    /* #swagger.parameters['Registration'] = {
          in: 'body',
          required: true,
          schema: { $ref: '#/definitions/PostRegisterRequest' },
        }, */
    /* #swagger.responses[200] = {
          description: '',
          schema: { $ref: '#/definitions/PostRegisterResponseSuccess' },
        } */
    /* #swagger.responses[400] = {
          description: '',
          schema: { $ref: '#/definitions/PostRegisterResponseBadRequest' },
        } */
    /* #swagger.responses[500] = {
          description: '',
          schema: { $ref: '#/definitions/PostRegisterResponseInternalServerError' },
        } */
    const validationResponse: TypeGuardValidationResult<RegistrationRequestType> =
      TypeGuardValdiationUtil.validate<RegistrationRequestType>(RegistrationRequestTypeGuard, req.body);
    if (validationResponse.name === 'validation-error') {
      res.status(400).json({
        name: 'validation-error',
        error: validationResponse.error,
        data: validationResponse.data,
      });
      return;
    }
    const userRegistrationResponseData: RegistrationResponseType | string =
      await DatabaseOperationsService.getInstance().registerUser(validationResponse.data);
    if (typeof userRegistrationResponseData === 'string') {
      res.status(500).json({
        name: 'http-error',
        error: userRegistrationResponseData,
      });
      return;
    }
    res.status(200).json({
      name: 'http-success',
      data: userRegistrationResponseData,
    });
  }
);

export default simpleTokenController;
