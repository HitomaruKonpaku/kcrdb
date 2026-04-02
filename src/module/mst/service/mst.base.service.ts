import { ModuleRef } from '@nestjs/core'
import { KC_LANG_DEFAULT } from '../../../constant/common.constant'
import { DataService } from '../../data/service/data.service'
import { TranslateService } from '../../translate/service/translate.service'
import { MstBaseEntity } from '../model/mst.base.entity'
import { MstBaseRepository } from '../repository/mst.base.repository'

export abstract class MstBaseService<E extends MstBaseEntity, R extends MstBaseRepository<E>> {
  protected abstract readonly CACHE_KEY: string
  protected abstract readonly DATA_URL: string

  constructor(
    public readonly repository: R,
    public readonly moduleRef: ModuleRef,
  ) { }

  protected get dataService() {
    return this.moduleRef.get(DataService, { strict: false })
  }

  protected get translateService() {
    return this.moduleRef.get(TranslateService, { strict: false })
  }

  public async getByIds(ids: number[], language: string = KC_LANG_DEFAULT): Promise<E[]> {
    if (!ids?.length) {
      return []
    }

    const items = (!language || language === KC_LANG_DEFAULT)
      ? await this.getItems()
      : await this.getItemsByLanguage(language)

    const res = ids.reduce((arr, id) => {
      if (items[id]) {
        arr.push(items[id])
      }
      return arr
    }, [] as any[])

    return res
  }

  protected async getItems(): Promise<Record<string, any>> {
    const items = await this.dataService.getData<Record<string, any>>(
      this.CACHE_KEY,
      this.DATA_URL,
      {
        transformRemoteResponse: (data: any[]) => {
          const res = data.reduce((obj, item) => {
            Object.assign(obj, { [item.api_id]: item })
            return obj
          }, {})
          return res
        },
      },
    )

    return items
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async getItemsByLanguage(language: string): Promise<Record<string, any>> {
    const items = await this.getItems()
    return items
  }
}
