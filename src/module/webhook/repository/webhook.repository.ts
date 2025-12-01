import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../../../shared/base/base.repository'
import { Webhook } from '../model/webhook.entity'

@Injectable()
export class WebhookRepository extends BaseRepository<Webhook> {
  constructor(
    @InjectRepository(Webhook)
    public readonly repository: Repository<Webhook>,
  ) {
    super(repository)
  }
}
