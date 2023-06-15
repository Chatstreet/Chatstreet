import { NextFunction } from 'express';
import { Subject, concatMap } from 'rxjs';

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

  public addToQueue(nextFunction: NextFunction): void {
    // TODO: Implement logging
    this.requestQueue$.next(nextFunction);
  }

  // Getter
  public getRequestQueue(): Subject<NextFunction> {
    return this.requestQueue$;
  }
}
