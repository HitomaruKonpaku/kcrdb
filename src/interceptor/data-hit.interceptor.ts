import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable, tap } from 'rxjs'
import { DataSource, In } from 'typeorm'
import { parseSourceName } from '../decorator/source-name.decorator'
import { Logger } from '../shared/logger'

@Injectable()
export class DataHitInterceptor implements NestInterceptor {
  private readonly logger = new Logger(DataHitInterceptor.name)

  constructor(
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
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

        await this.dataSource.manager
          .createQueryBuilder()
          .update(sourceName)
          .set({ hit: () => 'COALESCE(hit, 0) + 1' })
          .andWhere({ id: In(sourceIds) })
          .execute()
          .catch((error) => {
            this.logger.error(error)
          })
      }),
    )
  }
}
