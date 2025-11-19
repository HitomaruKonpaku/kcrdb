import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { ServerResponse } from 'http'
import { catchError, forkJoin, from, map, Observable, of, switchMap, tap } from 'rxjs'
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
        switchMap((key) => this.getCacheEntry(key)),
        switchMap(({ key, value }) => {
          if (value !== undefined && value !== null) {
            return this.handleCached(context, key, value)
          }
          return this.handleNoneCache(context, next, sourceName, sourceId)
        }),
      )
    }

    return this.handleNoneCache(context, next, sourceName, sourceId)
  }

  private getCacheEntry(key: string) {
    return from(this.cache.get<string>(key)).pipe(
      map((value) => ({ key, value })),
      catchError(() => of({ key, value: undefined })),
    )
  }

  private handleCached(context: ExecutionContext, key: string, value: any): Observable<any> {
    const res = context.switchToHttp().getResponse<ServerResponse>()
    res.setHeader('X-Cache', 1)

    return of(null).pipe(
      switchMap(() => forkJoin([
        from(this.cache.ttl(key)).pipe(
          catchError(() => of(null)),
          tap((ttl) => {
            if (!ttl) return
            res.setHeader('X-Cache-TTL', ttl)
          }),
        ),
      ])),
      map(() => JSON.parse(value)),
    )
  }

  private handleNoneCache(context: ExecutionContext, next: CallHandler, sourceName: string, sourceId: string): Observable<any> {
    const res = context.switchToHttp().getResponse<ServerResponse>()
    res.setHeader('X-Cache', 0)

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
}
