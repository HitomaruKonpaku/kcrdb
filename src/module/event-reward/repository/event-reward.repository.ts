import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../../../shared/base/base.repository'
import { EventReward } from '../model/event-reward.entity'

@Injectable()
export class EventRewardRepository extends BaseRepository<EventReward> {
  constructor(
    @InjectRepository(EventReward)
    public readonly repository: Repository<EventReward>,
  ) {
    super(repository)
  }
}
