import { Injectable } from '@nestjs/common'
import { SelectQueryBuilder } from 'typeorm'
import { PagingDto } from '../../../shared/dto/paging.dto'
import { TimeFilterDto } from '../../../shared/dto/time-filter.dto'
import { KcsapiService } from '../../../shared/kcsapi/kcsapi.service'
import { QueryBuilderUtil } from '../../../shared/util/query-builder.util'
import { RemodelSlotlistCreate } from '../dto/remodel-slotlist-create.dto'
import { RemodelSlotFilter } from '../dto/remodel-slotlist-filter.dto'
import { RemodelSlot } from '../model/remodel-slot.entity'
import { RemodelSlotRepository } from '../repository/remodel-slot.repository'

@Injectable()
export class RemodelSlotService extends KcsapiService<RemodelSlot, RemodelSlotRepository> {
  constructor(
    public readonly repository: RemodelSlotRepository,
  ) {
    super(repository)
  }

  public async getAll(
    paging?: PagingDto,
    filter?: RemodelSlotFilter,
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
      'api_id',
      'api_slot_id',
      'api_slot_level',
      // 'api_certain_flag',
      'data',
    ]
    const res = super.createOneWithHashFields(body, hashFields)
    return res
  }

  private initQueryBuilder(
    paging?: PagingDto,
    filter?: RemodelSlotFilter,
    timeFilter?: TimeFilterDto,
    baseQueryBuilder?: SelectQueryBuilder<RemodelSlot>,
  ): SelectQueryBuilder<RemodelSlot> {
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
        'api_certain_flag',
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
        'api_certain_flag',
      ],
      filter?.sort,
    )
    QueryBuilderUtil.applyQueryPaging(qb, paging)
    return qb
  }
}
