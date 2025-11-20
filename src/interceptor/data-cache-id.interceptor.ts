import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ServerResponse } from 'http'
import { catchError, forkJoin, from, map, Observable, of, switchMap, tap } from 'rxjs'
import { parseSourceName } from '../decorator/source-name.decorator'
import { CacheUtil } from '../shared/util/cache.util'

@Injectable()
export class DataCacheIdInterceptor implements NestInterceptor {
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

    if (req.method === 'GET' && req.params.id) {
      return of(null).pipe(
        map(() => CacheUtil.key(sourceName, req.params.id)),
        switchMap((key) => this.getCacheEntry(key)),
        switchMap(({ key, value }) => {
          if (value !== undefined && value !== null) {
            return this.handleCached(context, key, value)
          }
          return this.handleNoneCache(context, next, sourceName)
        }),
      )
    }

    return this.handleNoneCache(context, next, sourceName)
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
            res.setHeader('X-Cache-Exp', ttl)
          }),
        ),
      ])),
      map(() => JSON.parse(value)),
    )
  }

  private handleNoneCache(context: ExecutionContext, next: CallHandler, sourceName: string): Observable<any> {
    const res = context.switchToHttp().getResponse<ServerResponse>()
    res.setHeader('X-Cache', 0)

    return next.handle().pipe(
      tap((data) => {
        if (!data || !data.id) {
          return
        }

        const key = CacheUtil.key(sourceName, data.id)
        this.cache.set(key, JSON.stringify(data))
      }),
    )
  }
}
