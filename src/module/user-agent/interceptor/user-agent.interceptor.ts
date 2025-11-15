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
import { Logger } from '../../../shared/logger'
import { UserAgent } from '../model/user-agent.entity'
import { UserAgentService } from '../service/user-agent.service'

@Injectable()
export class UserAgentInterceptor implements NestInterceptor {
  private readonly logger = new Logger(UserAgentInterceptor.name)

  constructor(
    private readonly reflector: Reflector,
    private readonly service: UserAgentService,
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(async (data) => {
        const sourceName = parseSourceName(this.reflector, context)
        if (!sourceName) {
          return
        }

        const sourceIds = (data.ids || [data.id]).filter((v) => v) as string[]
        if (!sourceIds.length) {
          return
        }

        const req = context.switchToHttp().getRequest<Request>()
        const headers = req.headers
        const raw = headers['user-agent']
        const origin = headers['origin']
        const xOrigin = headers['x-origin'] || headers['data-origin']
        const xVersion = headers['x-version'] || headers['data-version']
        if (!raw) {
          this.logger.warn(`intercept: user-agent not found | ${JSON.stringify({
            method: req.method,
            url: req.url,
            headers,
          })}`)
          return
        }

        const items: Partial<UserAgent>[] = sourceIds.map((sourceId) => ({
          sourceName,
          sourceId,
          raw,
          origin,
          xOrigin,
          xVersion,
        }))
        await this.service
          .insertOrIgnoreMany(items)
          .catch((error) => {
            this.logger.error(error)
          })
      }),
    )
  }
}
