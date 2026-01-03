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
import { IdUtil } from '../../../shared/util/id.util'
import { ObjectUtil } from '../../../shared/util/object.util'
import { RequestUtil } from '../../../shared/util/request.util'
import { USER_AGENT_UNIQUE_KEYS } from '../constant/user-agent.constant'
import { UserAgent } from '../model/user-agent.entity'
import { UserAgentRepository } from '../repository/user-agent.repository'

@Injectable()
export class UserAgentInterceptor implements NestInterceptor {
  private readonly logger = new Logger(UserAgentInterceptor.name)

  constructor(
    private readonly reflector: Reflector,
    private readonly repository: UserAgentRepository,
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
        const origin = RequestUtil.getOrigin(req.headers)
        const xOrigin = RequestUtil.getXOrigin(req.headers)
        const xVersion = RequestUtil.getXVersion(req.headers)
        if (!raw) {
          this.logger.warn(`intercept: user-agent not found | ${JSON.stringify({
            method: req.method,
            url: req.url,
            headers,
          })}`)
          return
        }

        const items: Partial<UserAgent>[] = sourceIds.map((sourceId) => {
          const obj: Partial<UserAgent> = {
            id: IdUtil.generate(),
            sourceName,
            sourceId,
            raw,
            origin,
            xOrigin,
            xVersion,
          }
          obj.hash = ObjectUtil.hash(obj, USER_AGENT_UNIQUE_KEYS)
          return obj
        })

        try {
          await this.repository.insertAndHit(items)
        } catch (error) {
          this.logger.error(`insertAndHit: ${error.message} | ${JSON.stringify({ error })}`)
        }
      }),
    )
  }
}
