import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { KcsapiService } from '../../../shared/kcsapi/kcsapi.service'
import { RemodelSlotlistDetail } from '../model/remodel-slotlist-detail.entity'
import { RemodelSlotlistDetailRepository } from '../repository/remodel-slotlist-detail.repository'

@Injectable()
export class RemodelSlotlistDetailService extends KcsapiService<RemodelSlotlistDetail, RemodelSlotlistDetailRepository> {
  constructor(
    public readonly repository: RemodelSlotlistDetailRepository,
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
      'api_id',
      'api_slot_id',
      'api_slot_level',
    ]
  }

  protected getQueryMatchFilterFields(): string[] {
    return [
      'state',
      'flag_ship_id',
      'helper_ship_id',
      'day',
      'api_id',
      'api_slot_id',
      'api_slot_level',
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
      'api_id',
      'api_slot_id',
      'api_slot_level',
    ]
  }
}
