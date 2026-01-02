import { ModuleRef } from '@nestjs/core'
import { SelectQueryBuilder } from 'typeorm'
import { UserAgentService } from '../../module/user-agent/service/user-agent.service'
import { BaseRepository } from '../base/base.repository'
import { BaseService } from '../base/base.service'
import { PagingDto } from '../dto/paging.dto'
import { TimeFilterDto } from '../dto/time-filter.dto'
import { ObjectUtil } from '../util/object.util'
import { QueryBuilderUtil } from '../util/query-builder.util'
import { KcsapiExtraDto } from './dto/kcsapi-extra.dto'
import { KcsapiEntity } from './kcsapi.entity'

export abstract class KcsapiService<E extends KcsapiEntity<any>, R extends BaseRepository<E>> extends BaseService<E, R> {
  constructor(
    public readonly repository: R,
    public readonly moduleRef: ModuleRef,
  ) {
    super(repository)
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
    const res = await this.createOneWithHashFields(body, this.getHashFields())
    return res
  }

  public async createOneWithHashFields(
    body: Record<string, any>,
    hashFields: string[],
  ) {
    const hash = ObjectUtil.hash(body, hashFields)
    let res = await this.repository.findOneBy({ hash } as any)
    if (res) {
      res.hash = hash
      return res
    }

    const tmp: any = {
      ...body,
      hash,
    }

    res = await this.insertLoop(tmp)
    res.hash = hash
    return res
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
      await this.userAgentService.attachOrigins(entities, this.repository.tableName)
    }
  }
}
