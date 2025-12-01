import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../../../shared/base/base.repository'
import { WebhookHistory } from '../model/webhook-history.entity'

@Injectable()
export class WebhookHistoryRepository extends BaseRepository<WebhookHistory> {
  constructor(
    @InjectRepository(WebhookHistory)
    public readonly repository: Repository<WebhookHistory>,
  ) {
    super(repository)
  }
}
