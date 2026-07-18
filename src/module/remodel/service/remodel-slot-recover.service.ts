import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { RemodelSlotRecover } from '../model/remodel-slot-recover.entity'
import { RemodelSlotRecoverRepository } from '../repository/remodel-slot-recover.repository'
import { RemodelBaseService } from './remodel.base.service'

@Injectable()
export class RemodelSlotRecoverService extends RemodelBaseService<RemodelSlotRecover, RemodelSlotRecoverRepository> {
  protected readonly hasData = false

  constructor(
    public readonly repository: RemodelSlotRecoverRepository,
    public readonly moduleRef: ModuleRef,
  ) {
    super(repository, moduleRef)
  }

  protected getHashFields(): string[] {
    return [
      'flag_ship_id',
      'helper_ship_id',
      'day',
      'api_id',
      'api_slot_id',
      'api_slot_level',
      'api_dev_num',
      'api_recover_flag',
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
      'api_dev_num',
      'api_recover_flag',
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
      'api_dev_num',
      'api_recover_flag',
    ]
  }
}
