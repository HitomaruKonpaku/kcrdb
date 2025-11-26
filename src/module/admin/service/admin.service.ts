/* eslint-disable camelcase */
/* eslint-disable quotes */

import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import axios from 'axios'
import { Brackets, DataSource } from 'typeorm'
import { Logger } from '../../../shared/logger'
import { Quest } from '../../quest/model/quest.entity'

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name)

  private readonly KC3_QUEST_URL = 'https://raw.githubusercontent.com/KC3Kai/kc3-translations/refs/heads/master/data/jp/quests.json'

  constructor(
    private readonly dataSource: DataSource,
  ) { }

  @Cron('0 0 * * * *', { waitForCompletion: true })
  onTick() {
    this.verifyQuest()
  }

  public async verifyQuest() {
    const t0 = performance.now()
    this.logger.debug('verifyQuest')

    const data = await this.fetchQuest()
    const items = Object.keys(data)
      .map((key) => {
        const api_no = Number(key)
        const api_title = data[key].name
        const api_detail = data[key].desc
        return {
          api_no,
          api_title,
          api_detail,
        }
      })
      .filter((v) => !Number.isNaN(v.api_no))

    if (items.length) {
      try {
        await this.dataSource.transaction(async (manager) => {
          await manager.createQueryBuilder()
            .update(Quest)
            .set({ isVerified: true })
            .andWhere('isVerified = FALSE')
            .andWhere('isSus = FALSE')
            .andWhere('isMod = FALSE')
            .andWhere(new Brackets((qb) => {
              items.forEach((item, i) => {
                const api_no_key = `api_no_${i}`
                const api_title_key = `api_title_${i}`
                const api_detail_key = `api_detail_${i}`
                qb.orWhere(new Brackets((qb1) => {
                  qb1
                    .andWhere(`api_no = :${api_no_key}`, { [api_no_key]: item.api_no })
                    .andWhere(`api_title = :${api_title_key}`, { [api_title_key]: item.api_title })
                    .andWhere(`REPLACE(api_detail, '<br>', '') = REPLACE(:${api_detail_key}, '<br>', '')`, { [api_detail_key]: item.api_detail })
                }))
              })
            }))
            .execute()

          await manager.createQueryBuilder()
            .update(Quest)
            .set({ isSus: true })
            .andWhere('isVerified = FALSE')
            .andWhere('isSus = FALSE')
            .andWhere('isMod = FALSE')
            .andWhere('api_no IN (:...api_no)', { api_no: items.map((v) => v.api_no) })
            .execute()
        })
      } catch (error) {
        this.logger.error(`verifyQuest: ${error.message} | ${JSON.stringify({ error })}`)
      }
    }

    const dt = Math.floor(performance.now() - t0)
    this.logger.debug(`verifyQuest: ${dt}ms`)
  }

  public async fetchQuest(): Promise<Record<string, any>> {
    const { data } = await axios.get(this.KC3_QUEST_URL)
    return data
  }
}
