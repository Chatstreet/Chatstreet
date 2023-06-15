import { NextFunction, Request } from 'express';
import { Subject, concatMap } from 'rxjs';
import logger from 'npmlog';

export class RequestQueueingService {
  private readonly serviceName: string = '[REQUEST-QUEUEING-SERVICE]';
  private readonly requestQueue$: Subject<NextFunction> = new Subject<NextFunction>();
  private static instance: RequestQueueingService | null = null;

  private constructor() {
    this.requestQueue$
      .pipe(
        concatMap(
          (entry: NextFunction): Promise<void> =>
            new Promise(resolve => {
              resolve(entry());
            })
        )
      )
      .subscribe();
  }

  public static getInstance(): RequestQueueingService {
    if (!this.instance) {
      this.instance = new RequestQueueingService();
    }
    return this.instance;
  }

  public addToQueue(nextFunction: NextFunction, req: Request<unknown>): void {
    const timestamp = `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`;
    logger.info(
      `${this.serviceName}[${timestamp}]`,
      `Host: ${req.ip}, Location: ${req.path}, Params: ${JSON.stringify(req.params)}, Body: ${JSON.stringify(
        req.body
      )}, Headers: ${JSON.stringify(req.headers)}`
    );
    this.requestQueue$.next(nextFunction);
  }

  // Getter
  public getRequestQueue(): Subject<NextFunction> {
    return this.requestQueue$;
  }
}
