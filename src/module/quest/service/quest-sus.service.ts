import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { IsNull } from 'typeorm'
import { Logger } from '../../../shared/logger'
import { QuestApiRoot } from '../interface/quest-api.interface'
import { Quest } from '../model/quest.entity'
import { QuestRepository } from '../repository/quest.repository'

@Injectable()
export class QuestSusService {
  private readonly logger = new Logger(QuestSusService.name)

  constructor(
    public readonly repository: QuestRepository,
  ) { }

  public isSus(data: QuestApiRoot): boolean {
    try {
      if (/^.?\[[A-Za-z 0-9]+?\]/.test(data.api_title)) {
        return true
      }
    } catch (error) {
      this.logger.warn(`isSus: ${error.message} | ${JSON.stringify({ error, data })}`)
    }

    return false
  }

  @Cron('0 */10 * * * *', { waitForCompletion: true })
  async onTick() {
    try {
      const items = await this.repository.repository.find({
        where: { isSus: IsNull() },
        take: 1000,
      })
      if (!items.length) {
        return
      }

      const tmpItems: Partial<Quest>[] = items.map((v) => ({ id: v.id, isSus: this.isSus(v.data) }))
      await this.repository.saveAll(tmpItems)
      this.logger.log(`onTick: updated | ${JSON.stringify({ items: items.map((v) => ({ id: v.id, isSus: this.isSus(v.data) })) })}`)
    } catch (error) {
      this.logger.error(`onTick: ${error.message} | ${JSON.stringify({ error })}`)
    }
  }
}
