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
import { SOURCE_NAME } from '../../../decorator/source-name.decorator'
import { UserAgentService } from '../service/user-agent.service'

@Injectable()
export class UserAgentInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly service: UserAgentService,
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>()
    const headers = req.headers
    const raw = headers['user-agent']
    const origin = headers['origin']
    const xOrigin = headers['x-origin']
      || headers['data-origin']

    return next.handle().pipe(
      tap((data) => {
        const sourceName = this.reflector.getAllAndOverride<string>(
          SOURCE_NAME,
          [context.getHandler(), context.getClass()],
        )
        const sourceId = data.id
        if (!sourceName || !sourceId || !raw) {
          return
        }

        this.service.create({
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
