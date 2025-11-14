import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable, tap } from 'rxjs'
import { DataSource } from 'typeorm'
import { parseSourceName } from '../decorator/source-name.decorator'

@Injectable()
export class DataHitInterceptor implements NestInterceptor {
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

        const sourceId = data.id
        if (!sourceId) {
          return
        }

        await this.dataSource.manager
          .createQueryBuilder()
          .update(sourceName)
          .set({ hit: () => 'COALESCE(hit, 0) + 1' })
          .andWhere({ id: sourceId })
          .execute()
          .catch((error) => {
            console.error(error)
          })
      }),
    )
  }
}
