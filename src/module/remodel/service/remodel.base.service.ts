import { ModuleRef } from '@nestjs/core'
import { KC_LANG_DEFAULT } from '../../../constant/common.constant'
import { BaseRepository } from '../../../shared/base/base.repository'
import { PagingDto } from '../../../shared/dto/paging.dto'
import { TimeFilterDto } from '../../../shared/dto/time-filter.dto'
import { KcsapiService } from '../../../shared/kcsapi/kcsapi.service'
import { MstShip } from '../../mst/model/mst-ship.entity'
import { MstShipService } from '../../mst/service/mst-ship.service'
import { MstSlotitemService } from '../../mst/service/mst-slotitem.service'
import { RemodelExtraDto } from '../dto/remodel-extra.dto'
import { RemodelBase } from '../model/remodel.base.entity'

export abstract class RemodelBaseService<E extends RemodelBase<E>, R extends BaseRepository<E>> extends KcsapiService<E, R> {
  constructor(
    public readonly repository: R,
    public readonly moduleRef: ModuleRef,
  ) {
    super(repository, moduleRef)
  }

  protected get mstShipService() {
    return this.moduleRef.get(MstShipService, { strict: false })
  }

  protected get mstSlotitemService() {
    return this.moduleRef.get(MstSlotitemService, { strict: false })
  }

  public async getAll(
    paging?: PagingDto,
    filter?: Record<string, any>,
    timeFilter?: TimeFilterDto,
    extra?: RemodelExtraDto,
  ) {
    const res = await super.getAll(paging, filter, timeFilter, extra)
    if (extra?.metadata) {
      const metadata = await this.getMetadata(res.items, extra?.['metadata.lang'] || KC_LANG_DEFAULT)
      Object.assign(res, { metadata })
    }
    return res
  }

  protected getShipIds(items: E[]): number[] {
    const ids = [...new Set(
      items
        .reduce((arr, item) => {
          arr.push(item.flag_ship_id)
          arr.push(item.helper_ship_id)
          return arr
        }, [] as number[])
        .filter((v) => v),
    )]
    return ids
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getSlotitemIds(items: E[]): number[] {
    return []
  }

  protected async getMetadata(items: E[], language: string) {
    const metadata: Record<string, any> = {}
    const shipIds = this.getShipIds(items)
    const slotitemIds = this.getSlotitemIds(items)

    await Promise.allSettled([
      this.getMstShips(shipIds, language)
        .then((v) => {
          Object.assign(metadata, { api_mst_ship: v })
        })
        .catch((error) => {
          console.error(error.message)
        }),
      this.getMstSlotitems(slotitemIds, language)
        .then((v) => {
          Object.assign(metadata, { api_mst_slotitem: v })
        })
        .catch((error) => {
          console.error(error.message)
        }),
    ])

    const keys = [
      'api_mst_ship',
      'api_mst_slotitem',
    ]
    const res = keys.reduce((obj, key) => {
      if (metadata[key] !== undefined && metadata[key] !== null) {
        Object.assign(obj, { [key]: metadata[key] })
      }
      return obj
    }, {})
    return res
  }

  protected async getMstShips(ids: number[], language: string): Promise<MstShip[]> {
    const keys = [
      'api_id',
      'api_name',
    ]
    const items = await this.mstShipService.getByIds(ids, language)
    const res: any = items.map((v) => keys.reduce((obj, key) => Object.assign(obj, { [key]: v[key] }), {}))
    return res
  }

  protected async getMstSlotitems(ids: number[], language: string): Promise<MstShip[]> {
    const keys = [
      'api_id',
      'api_name',
    ]
    const items = await this.mstSlotitemService.getByIds(ids, language)
    const res: any = items.map((v) => keys.reduce((obj, key) => Object.assign(obj, { [key]: v[key] }), {}))
    return res
  }
}
