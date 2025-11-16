import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../../../shared/base/base.repository'
import { QuestItem } from '../model/quest-item.entity'

@Injectable()
export class QuestItemRepository extends BaseRepository<QuestItem> {
  constructor(
    @InjectRepository(QuestItem)
    public readonly repository: Repository<QuestItem>,
  ) {
    super(repository)
  }
}
