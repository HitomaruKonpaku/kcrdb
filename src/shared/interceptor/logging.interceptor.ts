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

    Logger.debug(`${method} --> ${req.path} | ${JSON.stringify(this.getRequestInfo(req))}`)

    return next.handle().pipe(
      tap((value) => {
        Logger.debug(`${method} <-- ${req.path} | ${Date.now() - now}ms | ${JSON.stringify(this.getResponseInfo(req, value))}`)
      }),
      catchError((error) => {
        Logger.error(`${method} <-- ${req.path} | ${Date.now() - now}ms | ${JSON.stringify(this.getErrorInfo(req, error))}`)
        throw error
      }),
    )
  }

  private getRequestInfo(req: any) {
    const res = {
      ip: req.ip,
    }
    if (Object.keys(req.query).length) {
      Object.assign(res, { query: req.query })
    }
    return res
  }

  private getResponseInfo(req: any, value: any) {
    const res = {
      ip: req.ip,
    }
    if (req.method === 'POST' && value) {
      if (value.id) {
        Object.assign(res, { id: value.id })
      }
      if (value.ids && value.ids.length) {
        Object.assign(res, { count: value.ids.length })
      }
    }
    return res
  }

  private getErrorInfo(req: any, error) {
    const res = {
      ip: req.ip,
      error,
    }
    return res
  }
}
