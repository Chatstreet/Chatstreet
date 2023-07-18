import { RequestQueueingService } from '@app/services/request-queueing/request-queueing.service';
import { Request, Response, NextFunction } from 'express';

const requestQueueingMiddleware = async (req: Request<unknown>, _: Response<unknown>, next: NextFunction) => {
  // Implement security for DDOS
  RequestQueueingService.getInstance().addToQueue(next, req);
};

export default requestQueueingMiddleware;
