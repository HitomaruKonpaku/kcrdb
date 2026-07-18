import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { KcsapiService } from '../../../shared/kcsapi/kcsapi.service'
import { EventReward } from '../model/event-reward.entity'
import { EventRewardRepository } from '../repository/event-reward.repository'

@Injectable()
export class EventRewardService extends KcsapiService<EventReward, EventRewardRepository> {
  protected readonly hasData = false

  constructor(
    public readonly repository: EventRewardRepository,
    public readonly moduleRef: ModuleRef,
  ) {
    super(repository, moduleRef)
  }

  protected getHashFields(): string[] {
    return [
      'world',
      'map',
      'difficulty',
      'api_get_eventitem',
      'api_select_reward_dict',
    ]
  }

  protected getQueryMatchFilterFields(): string[] {
    return [
      'state',
      'world',
      'map',
      'difficulty',
    ]
  }

  protected getQuerySortFields(): string[] {
    return [
      'created_at',
      'updated_at',
      'state',
      'hit',
      'world',
      'map',
      'difficulty',
    ]
  }
}
