import { Injectable } from '@nestjs/common'
import { Logger } from '../../../shared/logger'
import { QuestApiRoot } from '../interface/quest-api.interface'
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
}
