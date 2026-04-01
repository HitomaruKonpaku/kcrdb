import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { RemodelSlotCreate } from '../dto/remodel-slot-create.dto'
import { RemodelSlot } from '../model/remodel-slot.entity'
import { RemodelSlotRepository } from '../repository/remodel-slot.repository'
import { RemodelBaseService } from './remodel.base.service'

@Injectable()
export class RemodelSlotService extends RemodelBaseService<RemodelSlot, RemodelSlotRepository> {
  constructor(
    public readonly repository: RemodelSlotRepository,
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
      // 'api_certain_flag',
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
      'api_certain_flag',
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
      'api_certain_flag',
    ]
  }

  protected getSlotitemIds(items: RemodelSlot[]): number[] {
    const ids = [...new Set(
      items
        .reduce((arr, item) => {
          arr.push(item.api_slot_id)
          arr.push(...item.data.api_remodel_id)
          arr.push(item.data.api_after_slot.api_slotitem_id)
          return arr
        }, [] as number[])
        .filter((v) => v),
    )]
    return ids
  }

  public async create(body: RemodelSlotCreate) {
    /* eslint-disable no-param-reassign */
    // Remove user related data
    if (body.data) {
      delete body.data.api_after_material
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
    /* eslint-enable no-param-reassign */

    const res = await super.create(body)
    return res
  }
}
