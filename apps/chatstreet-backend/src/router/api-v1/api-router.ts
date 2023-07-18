import { Router, Request, Response } from 'express';
import secureEndpointsMiddleware from '@app/middleware/secure-endpoints/secure-endpoints.middleware';
import simpleTokenController from '@app/controller/token/simple-token.controller';
import secureTokenController from '@app/controller/token/secure-token.controller';
import passwordController from '@app/controller/password/password.controller';
import secureUsersController from '@app/controller/users/secure-users.controller';
import { AsyncHttpResponseType } from '@app/http/types/async-http-response.type';
import { HttpHealthResponseType } from './api-router.types';

const router: Router = Router();

router.use('/secure/*', secureEndpointsMiddleware);

router.use('/token', simpleTokenController);
router.use('/secure/token', secureTokenController);
router.use('/pwd', passwordController);
router.use('/secure/users', secureUsersController);

router.get('/health', (_: Request<unknown>, res: Response<AsyncHttpResponseType<HttpHealthResponseType>>): void => {
  // #swagger.tags = ['Miscellaneous']
  // #swagger.description = 'Check the servers health status.'
  /* #swagger.responses[200] = {
        description: 'Healthy response from server.',
        schema: { $ref: '#/definitions/GetHealthResponseSuccess' },
      } */
  res.status(200).json({
    name: 'http-success',
    data: {
      health: 'ok',
    },
  });
});

export default router;
