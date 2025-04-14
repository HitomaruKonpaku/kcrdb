/* eslint-disable dot-notation */
/* eslint-disable prefer-destructuring */

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable, tap } from 'rxjs'
import { parseSourceName } from '../../../decorator/source-name.decorator'
import { UserAgentService } from '../service/user-agent.service'

@Injectable()
export class UserAgentInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly service: UserAgentService,
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(async (data) => {
        const sourceName = parseSourceName(this.reflector, context)
        const sourceId = data.id
        if (!sourceName || !sourceId) {
          return
        }

        const req = context.switchToHttp().getRequest<Request>()
        const headers = req.headers
        const raw = headers['user-agent']
        const origin = headers['origin']
        const xOrigin = headers['x-origin']
          || headers['data-origin']
        if (!raw) {
          return
        }

        await this.service.insertOrIgnore({
          sourceName,
          sourceId,
          raw,
          origin,
          xOrigin,
        })
      }),
    )
  }
}
