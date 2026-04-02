import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { MstSlotitem } from '../model/mst-slotitem.entity'
import { MstSlotitemRepository } from '../repository/mst-slotitem.repository'
import { MstBaseService } from './mst.base.service'

@Injectable()
export class MstSlotitemService extends MstBaseService<MstSlotitem, MstSlotitemRepository> {
  protected CACHE_KEY: string = 'kc.mst.slotitem'
  protected DATA_URL: string = 'https://raw.githubusercontent.com/Tibowl/api_start2/refs/heads/master/parsed/api_mst_slotitem.json'

  constructor(
    public readonly repository: MstSlotitemRepository,
    public readonly moduleRef: ModuleRef,
  ) {
    super(repository, moduleRef)
  }

  protected async getItemsByLanguage(language: string): Promise<Record<string, any>> {
    const items = await super.getItems()
    const tls = await this.translateService.getSlotitemTranslations(language)

    Object.values(items).forEach((v) => {
      const tl = tls[v.api_name]
      // eslint-disable-next-line no-param-reassign
      v.api_name = tl ?? v.api_name
    })

    return items
  }
}
