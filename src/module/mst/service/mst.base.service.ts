import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import { ModuleRef } from '@nestjs/core'
import axios from 'axios'
import { Logger } from '../../../shared/logger'
import { MstShip } from '../model/mst-ship.entity'
import { MstBaseEntity } from '../model/mst.base.entity'
import { MstBaseRepository } from '../repository/mst.base.repository'

export abstract class MstBaseService<E extends MstBaseEntity, R extends MstBaseRepository<E>> {
  protected abstract readonly DATA_URL: string
  protected abstract readonly CACHE_KEY: string

  protected readonly logger = new Logger(MstBaseService.name)

  constructor(
    public readonly repository: R,
    public readonly moduleRef: ModuleRef,
  ) { }

  protected get cache(): Cache {
    return this.moduleRef.get(CACHE_MANAGER, { strict: false })
  }

  public async getByIds(ids: number[]): Promise<MstShip[]> {
    const items = await this.getData()
    const res = items.filter((v) => ids.includes(v.api_id))
    return res
  }

  public async getData(): Promise<MstShip[]> {
    let items: any

    if (!items) {
      try {
        items = await this.fetchLocalData()
      } catch (error) {
        this.logger.warn(`getData#local: ${error.message}`)
      }
    }

    if (!items) {
      try {
        items = await this.fetchRemoteData()
        await this.cache.set(this.CACHE_KEY, JSON.stringify(items))
      } catch (error) {
        this.logger.warn(`getData#remote: ${error.message}`)
      }
    }

    items = items || []
    return items
  }

  public async fetchLocalData() {
    const tmp = await this.cache.get<string>(this.CACHE_KEY)
    const data = tmp ? JSON.parse(tmp) : tmp
    return data
  }

  public async fetchRemoteData() {
    const { data } = await axios.get<any[]>(this.DATA_URL)
    return data
  }
}
