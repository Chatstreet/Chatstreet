import { Router } from 'express';
import secureEndpointsMiddleware from '@app/middleware/secure-endpoints.middleware';
import tokenController from '@app/controller/token.controller';
import passwordController from '@app/controller/password.controller';
import usersController from '@app/controller/users.controller';

const router: Router = Router();

router.use('/secure/*', secureEndpointsMiddleware);

router.use(['/token', '/secure/token'], tokenController);
router.use('/pwd', passwordController);
router.use('/secure/users', usersController);

export default router;
