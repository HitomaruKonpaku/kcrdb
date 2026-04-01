import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { Logger } from '../../../shared/logger'
import { MstSlotitem } from '../model/mst-slotitem.entity'
import { MstSlotitemRepository } from '../repository/mst-slotitem.repository'
import { MstBaseService } from './mst.base.service'

@Injectable()
export class MstSlotitemService extends MstBaseService<MstSlotitem, MstSlotitemRepository> {
  protected DATA_URL: string = 'https://raw.githubusercontent.com/Tibowl/api_start2/refs/heads/master/parsed/api_mst_slotitem.json'
  protected CACHE_KEY: string = 'kc.mst.slotitem'

  protected readonly logger = new Logger(MstSlotitemService.name)

  constructor(
    public readonly repository: MstSlotitemRepository,
    public readonly moduleRef: ModuleRef,
  ) {
    super(repository, moduleRef)
  }
}
