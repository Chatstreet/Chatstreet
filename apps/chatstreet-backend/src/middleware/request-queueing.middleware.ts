import { RequestQueueingService } from '@app/services/request-queueing.service';
import { Request, Response, NextFunction } from 'express';

const requestQueueingMiddleware = async (_: Request<unknown>, __: Response<unknown>, next: NextFunction) => {
  RequestQueueingService.getInstance().addToQueue(next);
};

export default requestQueueingMiddleware;
