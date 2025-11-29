import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { RequestUtil } from '../util/request.util'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now()
    const req = context.switchToHttp().getRequest()
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
    const res = this.getBaseInfo(req)
    if (Object.keys(req.query).length) {
      Object.assign(res, { query: req.query })
    }
    return res
  }

  private getResponseInfo(req: any, value: any) {
    const res = this.getBaseInfo(req)
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

  private getErrorInfo(req: any, error: any) {
    const res = {
      ...this.getBaseInfo(req),
      error,
    }
    return res
  }

  private getBaseInfo(req: any): Record<string, any> {
    const obj: Record<string, any> = {
      ip: req.ip,
    }
    const xOrigin = RequestUtil.getXOrigin(req.headers)
    const xVersion = RequestUtil.getXVersion(req.headers)
    if (xOrigin) {
      Object.assign(obj, { 'x-origin': xOrigin })
    }
    if (xVersion) {
      Object.assign(obj, { 'x-version': xVersion })
    }
    return obj
  }
}
