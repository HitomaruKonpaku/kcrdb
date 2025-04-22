import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { catchError, from, map, Observable, of, switchMap, tap } from 'rxjs'
import { parseSourceName } from '../decorator/source-name.decorator'
import { CacheUtil } from '../shared/util/cache.util'

@Injectable()
export class DataCacheInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const sourceName = parseSourceName(this.reflector, context)
    if (!sourceName) {
      return next.handle()
    }

    const req = context.switchToHttp().getRequest()
    const obs = next.handle().pipe(
      tap((data) => {
        if (!data || !data.id) {
          return
        }

        const key = CacheUtil.key(sourceName, data.id)
        this.cache.set(key, JSON.stringify(data))
      }),
    )

    if (req.method === 'GET' && req.params.id) {
      return of(null).pipe(
        map(() => CacheUtil.key(sourceName, req.params.id)),
        switchMap((key) => from(this.cache.get<string>(key)).pipe(
          catchError(() => of(null)),
        )),
        switchMap((value) => {
          if (value !== null) {
            return of(JSON.parse(value))
          }
          return obs
        }),
      )
    }

    return obs
  }
}
