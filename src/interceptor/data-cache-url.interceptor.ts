import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { catchError, from, map, Observable, of, switchMap, tap } from 'rxjs'
import { CacheUtil } from '../shared/util/cache.util'

@Injectable()
export class DataCacheUrlInterceptor implements NestInterceptor {
  private readonly ttl = 60e3

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    const sourceName = 'url'
    const sourceId = req.url

    if (req.method === 'GET') {
      return of(null).pipe(
        map(() => CacheUtil.key(sourceName, sourceId)),
        switchMap((key) => this.getCacheObservable(key)),
        switchMap((value) => {
          if (value !== undefined && value !== null) {
            return of(JSON.parse(value))
          }
          return this.handleObservable(next, sourceName, sourceId)
        }),
      )
    }

    return this.handleObservable(next, sourceName, sourceId)
  }

  private handleObservable(next: CallHandler, sourceName: string, sourceId: string) {
    return next.handle().pipe(
      tap((data) => {
        if (!data || !sourceId) {
          return
        }

        const key = CacheUtil.key(sourceName, sourceId)
        this.cache.set(key, JSON.stringify(data), this.ttl)
      }),
    )
  }

  private getCacheObservable(key: string) {
    return from(this.cache.get<string>(key)).pipe(
      catchError(() => of(null)),
    )
  }
}
