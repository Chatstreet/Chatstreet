import express, { Express } from 'express';
import cors from 'cors';
import EnvironmentsConfig from '@app/environments/environments.config';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(EnvironmentsConfig.getInstance().getPort(), () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${EnvironmentsConfig.getInstance().getPort()}`);
});

export default app;
