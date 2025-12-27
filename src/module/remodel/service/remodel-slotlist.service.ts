import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { SelectQueryBuilder } from 'typeorm'
import { PagingDto } from '../../../shared/dto/paging.dto'
import { TimeFilterDto } from '../../../shared/dto/time-filter.dto'
import { KcsapiService } from '../../../shared/kcsapi/kcsapi.service'
import { RemodelSlotlistFilter } from '../dto/remodel-slotlist-filter.dto'
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

  protected getHashFields(): string[] {
    return [
      'data',
      'flag_ship_id',
      'helper_ship_id',
      'day',
    ]
  }

  protected getQueryMatchFilterFields(): string[] {
    return [
      'state',
      'flag_ship_id',
      'helper_ship_id',
      'day',
    ]
  }

  protected getQuerySortFields(): string[] {
    return [
      'created_at',
      'updated_at',
      'state',
      'hit',
      'flag_ship_id',
      'helper_ship_id',
      'day',
    ]
  }

  protected initQueryBuilder(
    paging?: PagingDto,
    filter?: RemodelSlotlistFilter,
    timeFilter?: TimeFilterDto,
    baseQueryBuilder?: SelectQueryBuilder<RemodelSlotlist>,
  ): SelectQueryBuilder<RemodelSlotlist> {
    const qb = super.initQueryBuilder(paging, filter, timeFilter, baseQueryBuilder)
    const fields = [
      'api_id',
      'api_slot_id',
    ]

    fields.forEach((key) => {
      if (!filter?.[key]?.length) {
        return
      }

      qb.andWhere(
        `
EXISTS (
  SELECT 1
  FROM jsonb_array_elements(${qb.alias}.data::jsonb) AS api_data
  WHERE (api_data ->> '${key}')::int = ANY (:${key})
)
        `,
        { [key]: filter[key] },
      )
    })

    return qb
  }
}
