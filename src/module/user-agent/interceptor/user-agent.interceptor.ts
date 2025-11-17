/* eslint-disable prefer-destructuring */

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable, tap } from 'rxjs'
import { FindOptionsWhere, IsNull } from 'typeorm'
import { parseSourceName } from '../../../decorator/source-name.decorator'
import { Logger } from '../../../shared/logger'
import { RequestUtil } from '../../../shared/util/request.util'
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

        try {
          const items: Partial<UserAgent>[] = sourceIds.map((sourceId) => ({
            sourceName,
            sourceId,
            raw,
            origin,
            xOrigin,
            xVersion,
          }))

          const findItems: FindOptionsWhere<UserAgent>[] = items.map((obj) => {
            const tmp: FindOptionsWhere<UserAgent> = { ...obj }
            const keys = Object.keys(tmp)
            keys.forEach((key) => {
              if (tmp[key] === undefined || tmp[key] === null) {
                tmp[key] = IsNull()
              }
            })
            return tmp
          })

          await this.service.insertOrIgnoreMany(items)
          await this.service.repository.repository.update(
            findItems,
            { hit: () => 'COALESCE(hit, 0) + 1' },
          )
        } catch (error) {
          this.logger.error(`intercept: ${error.message} | ${JSON.stringify({ error })}`)
        }
      }),
    )
  }
}
