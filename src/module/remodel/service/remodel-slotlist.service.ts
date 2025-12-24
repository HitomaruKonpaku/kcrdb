import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { KcsapiService } from '../../../shared/kcsapi/kcsapi.service'
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
      'api_quest_id',
      'api_select_no',
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
}
