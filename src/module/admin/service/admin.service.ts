/* eslint-disable camelcase */
/* eslint-disable quotes */

import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import axios from 'axios'
import { Brackets, DataSource } from 'typeorm'
import { Quest } from '../../quest/model/quest.entity'

@Injectable()
export class AdminService {
  private readonly KC3_QUEST_URL = 'https://raw.githubusercontent.com/KC3Kai/kc3-translations/refs/heads/master/data/jp/quests.json'

  constructor(
    private readonly dataSource: DataSource,
  ) { }

  @Cron('0 */30 * * * *', { waitForCompletion: true })
  onTick() {
    this.verifyQuest()
  }

  public async verifyQuest() {
    console.time('verifyQuest')

    const { data } = await axios.get(this.KC3_QUEST_URL)

    const items = Object.keys(data)
      .map((key) => {
        const api_no = Number(key)
        const api_title = data[key].name
        const api_detail = data[key].desc
        return { api_no, api_title, api_detail }
      })
      .filter((v) => !Number.isNaN(v.api_no))

    await this.dataSource.transaction(async (manager) => {
      await Promise.all(items.map(async (item) => {
        try {
          await manager
            .createQueryBuilder()
            .update(Quest)
            .set({ isVerified: true })
            .andWhere('isVerified = FALSE')
            .andWhere(new Brackets((qb) => {
              qb
                .orWhere('isSus ISNULL')
                .orWhere('isSus = FALSE')
            }))
            .andWhere('api_no = :api_no', { api_no: item.api_no })
            .andWhere('api_title = :api_title', { api_title: item.api_title })
            .andWhere(`REPLACE(api_detail, '<br>', '') = :api_detail`, { api_detail: item.api_detail })
            .execute()

          await manager
            .createQueryBuilder()
            .update(Quest)
            .set({ isSus: true })
            .andWhere('isVerified = FALSE')
            .andWhere(new Brackets((qb) => {
              qb
                .orWhere('isSus ISNULL')
                .orWhere('isSus = FALSE')
            }))
            .andWhere('api_no = :api_no', { api_no: item.api_no })
            .execute()
        } catch (error) {
          console.error(error)
          throw error
        }
      }))
    })

    console.timeEnd('verifyQuest')
  }
}
