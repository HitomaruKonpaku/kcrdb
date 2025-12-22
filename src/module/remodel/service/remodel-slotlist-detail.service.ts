import { Injectable } from '@nestjs/common'
import { SelectQueryBuilder } from 'typeorm'
import { PagingDto } from '../../../shared/dto/paging.dto'
import { TimeFilterDto } from '../../../shared/dto/time-filter.dto'
import { KcsapiService } from '../../../shared/kcsapi/kcsapi.service'
import { QueryBuilderUtil } from '../../../shared/util/query-builder.util'
import { RemodelSlotlistDetailFilter } from '../dto/remodel-slot-filter.dto'
import { RemodelSlotlistDetailCreate } from '../dto/remodel-slotlist-detail-create.dto'
import { RemodelSlotlistDetail } from '../model/remodel-slotlist-detail.entity'
import { RemodelSlotlistDetailRepository } from '../repository/remodel-slotlist-detail.repository'

@Injectable()
export class RemodelSlotlistDetailService extends KcsapiService<RemodelSlotlistDetail, RemodelSlotlistDetailRepository> {
  constructor(
    public readonly repository: RemodelSlotlistDetailRepository,
  ) {
    super(repository)
  }

  public async getAll(
    paging?: PagingDto,
    filter?: RemodelSlotlistDetailFilter,
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

  public async create(body: RemodelSlotlistDetailCreate) {
    const hashFields = [
      'flag_ship_id',
      'helper_ship_id',
      'day',
      'api_id',
      'api_slot_id',
      'api_slot_level',
      'data',
    ]
    const res = super.createOneWithHashFields(body, hashFields)
    return res
  }

  private createQueryBuilder() {
    const qb = this.repository.repository.createQueryBuilder('rsd')
    return qb
  }

  private initQueryBuilder(
    paging?: PagingDto,
    filter?: RemodelSlotlistDetailFilter,
    timeFilter?: TimeFilterDto,
    baseQueryBuilder?: SelectQueryBuilder<RemodelSlotlistDetail>,
  ): SelectQueryBuilder<RemodelSlotlistDetail> {
    const qb = baseQueryBuilder || this.createQueryBuilder()
    QueryBuilderUtil.applyQueryTimeFilter(qb, timeFilter)
    QueryBuilderUtil.applyQueryMatchFilter(
      qb,
      [
        'state',
        'flag_ship_id',
        'helper_ship_id',
        'day',
        'api_id',
        'api_slot_id',
        'api_slot_level',
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
        'api_id',
        'api_slot_id',
        'api_slot_level',
      ],
      filter?.sort,
    )
    QueryBuilderUtil.applyQueryPaging(qb, paging)
    return qb
  }
}
