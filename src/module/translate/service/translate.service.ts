import { Injectable } from '@nestjs/common'
import { DataService } from '../../data/service/data.service'

@Injectable()
export class TranslateService {
  // https://raw.githubusercontent.com/KC3Kai/kc3-translations/refs/heads/master/data/en/ships.json
  // https://raw.githubusercontent.com/KC3Kai/kc3-translations/refs/heads/master/data/en/ship_affix.json
  // https://raw.githubusercontent.com/KC3Kai/kc3-translations/refs/heads/master/data/en/items.json

  constructor(
    public readonly dataService: DataService,
  ) { }

  public getKey(lang: string, file: string) {
    const key = ['kc3', 'tl', lang, file].join('.')
    return key
  }

  public getUrl(lang: string, file: string) {
    const url = `https://raw.githubusercontent.com/KC3Kai/kc3-translations/refs/heads/master/data/${lang}/${file}.json`
    return url
  }

  public async getData(lang: string, file: string) {
    const key = this.getKey(lang, file)
    const url = this.getUrl(lang, file)
    const data = await this.dataService.getData(key, url)
    return data
  }

  public async getShipTranslations(lang: string) {
    const [ship, shipAffix] = await Promise.all([
      this.getData(lang, 'ships'),
      this.getData(lang, 'ship_affix'),
    ])
    return { ship, shipAffix }
  }

  public async getSlotitemTranslations(lang: string) {
    const res = await this.getData(lang, 'items')
    return res
  }
}
