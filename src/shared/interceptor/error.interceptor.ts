import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, catchError, throwError } from 'rxjs'

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        Logger.error(error.stack)
        if (error instanceof HttpException) {
          return throwError(() => error)
        }
        return throwError(() => new InternalServerErrorException(error.message))
      }),
    )
  }
}
