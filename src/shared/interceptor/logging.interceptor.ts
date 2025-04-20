import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    const now = Date.now()
    const method = String(req.method).toUpperCase()
    const { ip } = req
    const detail = { ip }

    if (Object.keys(req.query).length) {
      Object.assign(detail, { query: req.query })
    }

    Logger.debug(`${method} --> ${req.path} | ${JSON.stringify(detail)}`)

    return next.handle().pipe(
      tap(() => {
        Logger.debug(`${method} <-- ${req.path} | ${Date.now() - now}ms | ${JSON.stringify({ ip })}`)
      }),
      catchError((error) => {
        Logger.error(`${method} <-- ${req.path} | ${Date.now() - now}ms | ${JSON.stringify({ ip, error })}`)
        throw error
      }),
    )
  }
}
