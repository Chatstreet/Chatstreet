import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import apiV1Router from '@app/router/api-router';
import EnvironmentsConfig from '@app/environments/environments.config';
import DatabaseOperationsService from './services/database-operations.service';
import { HttpResponseFailure } from './http/types/http-response.type';
import * as http from 'http';
import swaggerUi from 'swagger-ui-express';
import swaggerOutputFile from '@app/utils/swagger-autogen/swagger-output.json';
import requestQueueingMiddleware from './middleware/request-queueing.middleware';

const app: Express = express();
let server: http.Server | null = null;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/*', requestQueueingMiddleware);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerOutputFile));
app.use('/api/v1', apiV1Router);
// default response
app.use((req: Request<unknown>, res: Response<HttpResponseFailure>) => {
  const { path }: { path: string } = req;
  res.status(404).json({
    name: 'http-error',
    error: `The path '${path}' was not Found, use /swagger to get a documentation`,
  });
});

const appCallback = (error: Error): void => {
  if (error) {
    console.log(`⚡️[server]: Server start failed, ${error.message}`);
    return;
  }
  server = app.listen(EnvironmentsConfig.getInstance().getPort(), () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${EnvironmentsConfig.getInstance().getPort()}`);
  });
};

DatabaseOperationsService.getInstance().getConnection().connect(appCallback);

export default app;

export { server };
