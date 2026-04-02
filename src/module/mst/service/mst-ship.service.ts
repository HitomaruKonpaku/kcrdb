import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { MstShip } from '../model/mst-ship.entity'
import { MstShipRepository } from '../repository/mst-ship.repository'
import { MstBaseService } from './mst.base.service'

@Injectable()
export class MstShipService extends MstBaseService<MstShip, MstShipRepository> {
  protected CACHE_KEY: string = 'kc.mst.ship'
  protected DATA_URL: string = 'https://raw.githubusercontent.com/Tibowl/api_start2/refs/heads/master/parsed/api_mst_ship.json'

  constructor(
    public readonly repository: MstShipRepository,
    public readonly moduleRef: ModuleRef,
  ) {
    super(repository, moduleRef)
  }

  protected async getItemsByLanguage(language: string): Promise<Record<string, any>> {
    const items = await super.getItems()
    const { ship, shipAffix } = await this.translateService.getShipTranslations(language)

    const shipRx = Object.keys(ship).map((v) => `(?:${v.replace(/\(/g, '\\(').replace(/\)/g, '\\)')})`).join('|')
    const shipSuffixRx = Object.keys(shipAffix.suffixes).map((v) => `(?:${v.replace(/\(/g, '\\(').replace(/\)/g, '\\)')})`).join('|')

    Object.values(items).forEach((v) => {
      const { api_id: id } = v
      let { api_name: name } = v

      if (shipAffix?.byId?.[id]) {
        // eslint-disable-next-line no-param-reassign
        v.api_name = shipAffix.byId[id]
        return
      }

      if (ship[name]) {
        // eslint-disable-next-line no-param-reassign
        v.api_name = ship[name]
        return
      }

      let tlName = ''

      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < 10; index++) {
        if (!name) {
          break
        }

        const regex = new RegExp(!index ? shipRx : shipSuffixRx)
        const key = regex.exec(name)?.[0]
        if (!key) {
          break
        }

        if (!index) {
          tlName += ship[key]
        } else {
          tlName += shipAffix.suffixes[key]
        }

        name = name.replace(key, '')
      }

      // eslint-disable-next-line no-param-reassign
      v.api_name = tlName || v.api_name
    })

    return items
  }
}
