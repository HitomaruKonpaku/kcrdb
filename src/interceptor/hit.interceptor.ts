import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import Bottleneck from 'bottleneck'
import { Observable, tap } from 'rxjs'
import { DataSource } from 'typeorm'
import { parseSourceName } from '../decorator/source-name.decorator'

@Injectable()
export class HitInterceptor implements NestInterceptor {
  private readonly limiter = new Bottleneck({ maxConcurrent: 1 })

  constructor(
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(async (data) => {
        const sourceName = parseSourceName(this.reflector, context)
        const sourceId = data.id
        if (!sourceName || !sourceId) {
          return
        }

        await this.limiter.schedule(async () => {
          await this.dataSource.manager
            .createQueryBuilder()
            .update(sourceName)
            .set({ hit: () => 'COALESCE(hit, 0) + 1' })
            .andWhere({ id: sourceId })
            .execute()
        })
      }),
    )
  }
}
