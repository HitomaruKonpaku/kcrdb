import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../../../shared/base/base.repository'
import { Quest } from '../model/quest.entity'

@Injectable()
export class QuestRepository extends BaseRepository<Quest> {
  constructor(
    @InjectRepository(Quest)
    public readonly repository: Repository<Quest>,
  ) {
    super(repository)
  }
}
