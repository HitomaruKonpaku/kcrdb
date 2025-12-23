import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { SelectQueryBuilder } from 'typeorm'
import { PagingDto } from '../../../shared/dto/paging.dto'
import { TimeFilterDto } from '../../../shared/dto/time-filter.dto'
import { KcsapiService } from '../../../shared/kcsapi/kcsapi.service'
import { QueryBuilderUtil } from '../../../shared/util/query-builder.util'
import { RemodelSlotlistCreate } from '../dto/remodel-slotlist-create.dto'
import { RemodelSlotlistFilter } from '../dto/remodel-slotlist-detail-filter.dto'
import { RemodelSlotlist } from '../model/remodel-slotlist.entity'
import { RemodelSlotlistRepository } from '../repository/remodel-slotlist.repository'

@Injectable()
export class RemodelSlotlistService extends KcsapiService<RemodelSlotlist, RemodelSlotlistRepository> {
  constructor(
    public readonly repository: RemodelSlotlistRepository,
    public readonly moduleRef: ModuleRef,
  ) {
    super(repository, moduleRef)
  }

  public async getAll(
    paging?: PagingDto,
    filter?: RemodelSlotlistFilter,
    timeFilter?: TimeFilterDto,
  ) {
    const qb = this.createQueryBuilder()
    qb.addSelect(`${qb.alias}.updatedAt`)
    this.initQueryBuilder(paging, filter, timeFilter, qb)
    const [items, total] = await qb.getManyAndCount()
    return {
      total,
      items,
    }
  }

  public async create(body: RemodelSlotlistCreate) {
    const hashFields = [
      'flag_ship_id',
      'helper_ship_id',
      'day',
      'data',
    ]
    const res = super.createOneWithHashFields(body, hashFields)
    return res
  }

  private initQueryBuilder(
    paging?: PagingDto,
    filter?: RemodelSlotlistFilter,
    timeFilter?: TimeFilterDto,
    baseQueryBuilder?: SelectQueryBuilder<RemodelSlotlist>,
  ): SelectQueryBuilder<RemodelSlotlist> {
    const qb = baseQueryBuilder || this.createQueryBuilder()
    QueryBuilderUtil.applyQueryTimeFilter(qb, timeFilter)
    QueryBuilderUtil.applyQueryMatchFilter(
      qb,
      [
        'state',
        'flag_ship_id',
        'helper_ship_id',
        'day',
      ],
      filter,
    )
    QueryBuilderUtil.applyQuerySort(
      qb,
      [
        'created_at',
        'updated_at',
        'state',
        'hit',
        'flag_ship_id',
        'helper_ship_id',
        'day',
      ],
      filter?.sort,
    )
    QueryBuilderUtil.applyQueryPaging(qb, paging)
    return qb
  }
}
