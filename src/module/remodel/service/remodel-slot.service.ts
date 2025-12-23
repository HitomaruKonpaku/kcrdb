/* eslint-disable no-param-reassign */

import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { SelectQueryBuilder } from 'typeorm'
import { PagingDto } from '../../../shared/dto/paging.dto'
import { TimeFilterDto } from '../../../shared/dto/time-filter.dto'
import { KcsapiService } from '../../../shared/kcsapi/kcsapi.service'
import { QueryBuilderUtil } from '../../../shared/util/query-builder.util'
import { RemodelSlotCreate } from '../dto/remodel-slot-create.dto'
import { RemodelSlotFilter } from '../dto/remodel-slotlist-filter.dto'
import { RemodelSlot } from '../model/remodel-slot.entity'
import { RemodelSlotRepository } from '../repository/remodel-slot.repository'

@Injectable()
export class RemodelSlotService extends KcsapiService<RemodelSlot, RemodelSlotRepository> {
  constructor(
    public readonly repository: RemodelSlotRepository,
    public readonly moduleRef: ModuleRef,
  ) {
    super(repository, moduleRef)
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

  public async create(body: RemodelSlotCreate) {
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

    // Remove user related data
    if (body.data) {
      if (body.data.api_after_slot) {
        delete body.data.api_after_slot.api_id
        delete body.data.api_after_slot.api_locked
        delete body.data.api_after_slot.api_alv
      }
      if (body.data.api_use_slot_id) {
        if (Array.isArray(body.data.api_use_slot_id)) {
          body.data.api_use_slot_num = body.data.api_use_slot_id.length
        }
        delete body.data.api_use_slot_id
      }
    }

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
