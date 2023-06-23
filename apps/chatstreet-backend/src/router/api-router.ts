import { Router, Request, Response } from 'express';
import secureEndpointsMiddleware from '@app/middleware/secure-endpoints.middleware';
import tokenController from '@app/controller/token.controller';
import passwordController from '@app/controller/password.controller';
import secureUsersController from '@app/controller/secure-users.controller';
import { AsyncHttpResponseType } from '@app/http/types/async-http-response.type';
import { HttpHealthResponseType } from './api-router.types';
import secureTokenController from '@app/controller/secure-token.controller';

const router: Router = Router();

router.use('/secure/*', secureEndpointsMiddleware);

router.use('/token', tokenController);
router.use('/secure/token', secureTokenController);
router.use('/pwd', passwordController);
router.use('/secure/users', secureUsersController);

router.get('/health', (_: Request<unknown>, res: Response<AsyncHttpResponseType<HttpHealthResponseType>>): void => {
  res.status(200).json({
    name: 'http-success',
    data: {
      health: 'ok',
    },
  });
});

export default router;
