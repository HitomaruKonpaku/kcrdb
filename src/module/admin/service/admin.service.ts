/* eslint-disable camelcase */

import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import axios from 'axios'
import { Brackets, DataSource } from 'typeorm'
import { KcsapiState } from '../../../shared/kcsapi/kcsapi-state.enum'
import { Logger } from '../../../shared/logger'
import { IdUtil } from '../../../shared/util/id.util'
import { Quest } from '../../quest/model/quest.entity'
import { WebhookHistory } from '../../webhook/model/webhook-history.entity'
import { Webhook } from '../../webhook/model/webhook.entity'
import { WebhookService } from '../../webhook/service/webhook.service'
import { AdminQuestSusResetQuery } from '../dto/admin-quest-sus-reset-query.dto'

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name)

  private readonly KC3_QUEST_URL = 'https://raw.githubusercontent.com/KC3Kai/kc3-translations/refs/heads/master/data/jp/quests.json'

  constructor(
    private readonly dataSource: DataSource,
    private readonly webhookService: WebhookService,
  ) { }

  @Cron('0 */30 * * * *', { waitForCompletion: true })
  onTick() {
    this.verifyQuest()
  }

  public async fetchQuest(): Promise<Record<string, any>> {
    const { data } = await axios.get(this.KC3_QUEST_URL)
    return data
  }

  public async verifyQuest() {
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

    if (!items.length) {
      return
    }

    try {
      await this.dataSource.transaction(async (manager) => {
        await manager
          .createQueryBuilder()
          .update(Quest)
          .set({ state: KcsapiState.VERIFIED })
          .andWhere('state = :state', { state: KcsapiState.NEW })
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

        await manager
          .createQueryBuilder()
          .update(Quest)
          .set({ state: KcsapiState.SUS })
          .andWhere('state = :state', { state: KcsapiState.NEW })
          .andWhere('api_no IN (:...api_no)', { api_no: items.map((v) => v.api_no) })
          .execute()
      })
    } catch (error) {
      this.logger.error(`verifyQuest: ${error.message} | ${JSON.stringify({ error })}`)
    }

    this.notifyUnknownQuests()
  }

  public async confirmSusQuest() {
    const query = this.dataSource
      .createQueryBuilder()
      .update(Quest)
      .set({ state: KcsapiState.MODDED })
      .andWhere('state = :state', { state: KcsapiState.SUS })

    await query.execute()
  }

  public async resetSusQuest(q: AdminQuestSusResetQuery) {
    const query = this.dataSource
      .createQueryBuilder()
      .update(Quest)
      .set({ state: KcsapiState.NEW })

    if (q?.api_no?.length) {
      query
        .andWhere('state IN (:...state)', { state: [KcsapiState.SUS, KcsapiState.MODDED] })
        .andWhere('api_no IN (:...api_no)', { api_no: q.api_no })
    } else {
      query.andWhere('state = :state', { state: KcsapiState.SUS })
    }

    await query.execute()
  }

  private async notifyUnknownQuests() {
    const quests = await this.dataSource
      .createQueryBuilder(Quest, 'q')
      .andWhere('q.state = :state', { state: KcsapiState.NEW })
      .getMany()

    if (!quests.length) {
      return
    }

    const webhooks = await this.dataSource
      .createQueryBuilder(Webhook, 'w')
      .leftJoinAndMapOne('w.history', WebhookHistory, 'wh', 'wh.webhookId = w.id')
      .andWhere('w.isActive = TRUE')
      .andWhere('w.onQuestNewUnknown = TRUE')
      .andWhere('wh ISNULL')
      .getMany()

    if (!webhooks.length) {
      return
    }

    await Promise.allSettled(webhooks.map(async (webhook) => {
      await Promise.allSettled(quests.map(async (quest) => {
        const id = IdUtil.generate()
        const content = `\`\`\`${JSON.stringify(quest)}\`\`\``
        const repository = this.dataSource.getRepository(WebhookHistory)

        try {
          await repository
            .createQueryBuilder()
            .insert()
            .values({
              id,
              webhookId: webhook.id,
              sourceName: 'quest',
              sourceId: quest.id,
            })
            .orIgnore()
            .execute()

          await this.webhookService.send(webhook, content, true)

          await repository.update(
            { id },
            {
              isSuccess: true,
              isError: false,
              errorMessage: null,
              errorStack: null,
            } as any,
          )
        } catch (error) {
          await repository.update(
            { id },
            {
              isSuccess: false,
              isError: true,
              errorMessage: error.message,
              errorStack: error.stack,
            } as any,
          )
        }
      }))
    }))
  }
}
