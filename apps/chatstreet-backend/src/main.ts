import express, { Express } from 'express';
import cors from 'cors';
import apiV1Router from '@app/router/api-router';
import EnvironmentsConfig from '@app/environments/environments.config';
import DatabaseOperationsService from './services/database-operations.service';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', apiV1Router);

DatabaseOperationsService.getInstance()
  .getConnection()
  .connect((error: Error) => {
    if (error) {
      console.log(`⚡️[server]: Database connection failed, ${error.message}`);
      return;
    }
    app.listen(EnvironmentsConfig.getInstance().getPort(), () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${EnvironmentsConfig.getInstance().getPort()}`);
    });
  });

export default app;
