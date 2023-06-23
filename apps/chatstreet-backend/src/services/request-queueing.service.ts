import { NextFunction, Request } from 'express';
import { Subject, concatMap } from 'rxjs';
import LoggerWrapperUtil from '@app/utils/logger-wrapper.util';

export class RequestQueueingService {
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
    LoggerWrapperUtil.info(
      `Host: ${req.ip}, Location: ${req.path}, Params: ${JSON.stringify(req.params)}, Body: ${JSON.stringify(
        req.body
      )}, Headers: ${JSON.stringify(req.headers)}`,
      RequestQueueingService
    );
    this.requestQueue$.next(nextFunction);
  }

  // Getter
  public getRequestQueue(): Subject<NextFunction> {
    return this.requestQueue$;
  }
}
