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

  @Cron('0 */5 * * * *', { waitForCompletion: true })
  async onTick() {
    try {
      const items = await this.repository.repository.find({
        where: { isSus: IsNull() },
        order: { createdAt: 'DESC' },
        take: 500,
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
}
