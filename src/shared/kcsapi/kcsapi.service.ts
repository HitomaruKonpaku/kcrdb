import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { ConfigService } from '@nestjs/config'
import { ModuleRef } from '@nestjs/core'
import { FindOptionsWhere, SelectQueryBuilder } from 'typeorm'
import { UserAgentService } from '../../module/user-agent/service/user-agent.service'
import { BaseRepository } from '../base/base.repository'
import { BaseService } from '../base/base.service'
import { PagingDto } from '../dto/paging.dto'
import { TimeFilterDto } from '../dto/time-filter.dto'
import { Logger } from '../logger'
import { CacheUtil } from '../util/cache.util'
import { ObjectUtil } from '../util/object.util'
import { QueryBuilderUtil } from '../util/query-builder.util'
import { KcsapiExtraDto } from './dto/kcsapi-extra.dto'
import { KcsapiEntity } from './kcsapi.entity'

export abstract class KcsapiService<E extends KcsapiEntity<any>, R extends BaseRepository<E>> extends BaseService<E, R> {
  protected readonly logger = new Logger(this.constructor.name)
  protected readonly hasData: boolean = true

  protected ttl?: number = 60e3

  constructor(
    public readonly repository: R,
    public readonly moduleRef: ModuleRef,
  ) {
    super(repository)
    this.ttl = this.configService.get<number>('KCSAPI_TTL') || this.ttl
  }

  protected get configService() {
    return this.moduleRef.get(ConfigService, { strict: false })
  }

  protected get cache(): Cache {
    return this.moduleRef.get(CACHE_MANAGER, { strict: false })
  }

  protected get userAgentService() {
    return this.moduleRef.get(UserAgentService, { strict: false })
  }

  protected getHashFields(): string[] {
    return []
  }

  protected getQueryMatchFilterFields(): string[] {
    return []
  }

  protected getQueryLikeFilterFields(): string[] {
    return []
  }

  protected getQuerySortFields(): string[] {
    return []
  }

  public async getAll(
    paging?: PagingDto,
    filter?: Record<string, any>,
    timeFilter?: TimeFilterDto,
    extra?: KcsapiExtraDto,
  ) {
    const qb = this.createQueryBuilder()
    qb.addSelect(`${qb.alias}.updatedAt`)
    if (this.hasData) {
      qb.addSelect(`${qb.alias}.data`)
    }
    this.initQueryBuilder(paging, filter, timeFilter, qb)
    const [items, total] = await qb.getManyAndCount()
    await this.applyJoin(items, extra)
    return {
      total,
      items,
    }
  }

  public async getAllData(
    paging?: PagingDto,
    filter?: Record<string, any>,
    timeFilter?: TimeFilterDto,
  ) {
    const qb = this.initQueryBuilder(paging, filter, timeFilter)
    qb.select(`${qb.alias}.data`)
    const [items, total] = await qb.getManyAndCount()
    return {
      total,
      items: items.map((v) => v.data),
    }
  }

  public async create(body: Record<string, any>) {
    if (!this.hasData) {
      Object.assign(body, { data: null })
    }
    const res = await this.createOneWithHashFields(body, this.getHashFields())
    return res
  }

  public async createOneWithHashFields(
    body: Record<string, any>,
    hashFields: string[],
  ) {
    const hash = ObjectUtil.hash(body, hashFields)
    const data: any = { ...body, hash }
    const cacheKey = CacheUtil.key(this.repository.tableName, hash)
    let res = await this.cache.get<E>(cacheKey).catch((error) => {
      this.logger.warn(`createOneWithHashFields#cache#get: ${error?.message ?? error} | ${JSON.stringify({ key: cacheKey })}`)
      return undefined
    })
    if (res) {
      return res
    }

    try {
      res = await this.insertLoop(data)
      return res
    } catch (error) {
      if (error.code === '23505' && error.detail && error.detail.includes('(hash)')) {
        res = await this.repository.findOneBy({ hash } as FindOptionsWhere<E>) as E
        if (res) {
          return res
        }
      }
      throw error
    } finally {
      if (res) {
        res.hash = hash
        this.cache.set(cacheKey, res, this.ttl).catch((error) => {
          this.logger.warn(`createOneWithHashFields#cache#set: ${error?.message ?? error} | ${JSON.stringify({ key: cacheKey })}`)
        })
      }
    }
  }

  protected initQueryBuilder(
    paging?: PagingDto,
    filter?: Record<string, any>,
    timeFilter?: TimeFilterDto,
    baseQueryBuilder?: SelectQueryBuilder<E>,
  ): SelectQueryBuilder<E> {
    const qb = baseQueryBuilder || this.createQueryBuilder()
    qb.andWhere(`${qb.alias}.is_active = TRUE`)
    qb.andWhere(`${qb.alias}.deleted_at ISNULL`)
    QueryBuilderUtil.applyQueryTimeFilter(qb, timeFilter)

    let fields = this.getQueryMatchFilterFields()
    if (fields.length) {
      QueryBuilderUtil.applyQueryMatchFilter(qb, fields, filter)
    }

    fields = this.getQueryLikeFilterFields()
    if (fields.length) {
      QueryBuilderUtil.applyQueryLikeFilter(qb, fields, filter)
    }

    fields = this.getQuerySortFields()
    if (fields.length) {
      QueryBuilderUtil.applyQuerySort(qb, fields, filter?.sort)
    }

    QueryBuilderUtil.applyQueryPaging(qb, paging)
    return qb
  }

  protected async applyJoin(
    entities: E[],
    extra?: KcsapiExtraDto,
  ) {
    if (extra?.extend?.includes('origins')) {
      await this.userAgentService.attachOrigins(
        entities,
        this.repository.tableName,
        {
          query: extra['origin.query'],
          raw: extra['origin.raw'],
          origin: extra['origin.origin'],
          x_origin: extra['origin.x_origin'],
          x_version: extra['origin.x_version'],
        },
      )
    }
  }
}
