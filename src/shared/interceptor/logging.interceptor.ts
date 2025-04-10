import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { randomUUID } from 'crypto'
import { Observable } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    const id = randomUUID()
    const now = Date.now()
    const method = String(req.method).toUpperCase()

    Logger.debug(`${method} --> ${req.path} | ${JSON.stringify({ id, query: req.query })}`)

    return next.handle().pipe(
      tap(() => {
        Logger.debug(`${method} <-- ${req.path} | ${Date.now() - now}ms | ${JSON.stringify({ id })}`)
      }),
      catchError((error) => {
        Logger.error(`${method} <-- ${req.path} | ${Date.now() - now}ms | ${JSON.stringify({ id, error })}`)
        throw error
      }),
    )
  }
}
