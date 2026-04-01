import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { SelectQueryBuilder } from 'typeorm'
import { PagingDto } from '../../../shared/dto/paging.dto'
import { TimeFilterDto } from '../../../shared/dto/time-filter.dto'
import { RemodelSlotlistFilter } from '../dto/remodel-slotlist-filter.dto'
import { RemodelSlotlist } from '../model/remodel-slotlist.entity'
import { RemodelSlotlistRepository } from '../repository/remodel-slotlist.repository'
import { RemodelBaseService } from './remodel.base.service'

@Injectable()
export class RemodelSlotlistService extends RemodelBaseService<RemodelSlotlist, RemodelSlotlistRepository> {
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

  protected getSlotitemIds(items: RemodelSlotlist[]): number[] {
    const ids = [...new Set(
      items
        .reduce((arr, item) => {
          item.data.forEach((v) => {
            arr.push(v.api_slot_id)
          })
          return arr
        }, [] as number[])
        .filter((v) => v),
    )]
    return ids
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
