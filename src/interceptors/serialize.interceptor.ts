import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  RequestTimeoutException,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import {
  Observable,
  TimeoutError,
  catchError,
  map,
  throwError,
  timeout,
} from 'rxjs';

interface ClassConstructor {
  new (...args: any[]): unknown;
}

// Decorator
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Run something before a request is handled by the request handler
    console.log('I am running before the handler');

    return next.handle().pipe(
      map((data: any) => {
        // Run somthing before the response is sent out
        console.log('I am running before the response is sent out', data);

        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
      timeout(5000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err);
      }),
    );
  }
}
