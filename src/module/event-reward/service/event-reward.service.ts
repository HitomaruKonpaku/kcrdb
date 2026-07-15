import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { KcsapiService } from '../../../shared/kcsapi/kcsapi.service'
import { EventRewardCreate } from '../dto/event-reward-create.dto'
import { EventReward } from '../model/event-reward.entity'
import { EventRewardRepository } from '../repository/event-reward.repository'

@Injectable()
export class EventRewardService extends KcsapiService<EventReward, EventRewardRepository> {
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

  public async create(body: EventRewardCreate) {
    Object.assign(body, { data: null })
    const res = await super.create(body)
    return res
  }
}
