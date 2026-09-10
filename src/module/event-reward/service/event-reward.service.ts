import { BadRequestException, Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { KcsapiExtraDto } from '../../../shared/kcsapi/dto/kcsapi-extra.dto'
import { KcsapiService } from '../../../shared/kcsapi/kcsapi.service'
import { QueryBuilderUtil } from '../../../shared/util/query-builder.util'
import { EventRewardCreate } from '../dto/event-reward-create.dto'
import { EventRewardFilter } from '../dto/event-reward-filter.dto'
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

  public async getStats(
    filter?: EventRewardFilter,
  ) {
    const qb = this.createQueryBuilder()
    qb.andWhere(`${qb.alias}.is_active = TRUE`)
    qb.andWhere(`${qb.alias}.deleted_at ISNULL`)

    qb.select('world')
      .addSelect('map')
      .addSelect('difficulty')
      .addSelect('SUM(hit)', 'hit')

    QueryBuilderUtil.applyQueryMatchFilter(
      qb,
      ['world', 'map', 'difficulty'],
      filter,
    )

    qb.addGroupBy('world')
      .addGroupBy('map')
      .addGroupBy('difficulty')

    QueryBuilderUtil.applyQuerySort(
      qb,
      ['world', 'map', 'difficulty', 'hit'],
      filter?.sort || ['-world', 'map', 'difficulty'],
      {
        skipSortDefault: true,
        remapFields: {
          hit: 'SUM(hit)',
        },
      },
    )

    const items = await qb.getRawMany()
    items.forEach((v) => {
      // eslint-disable-next-line no-param-reassign
      v.hit = Number(v.hit)
    })

    return {
      total: items.length,
      items,
    }
  }

  public async getStatsFull(
    filter?: EventRewardFilter,
    extra?: KcsapiExtraDto,
  ) {
    const qb = this.createQueryBuilder()
    qb.select(`${qb.alias}.id`)
      .addSelect(`${qb.alias}.createdAt`)
      .addSelect(`${qb.alias}.updatedAt`)
      .addSelect(`${qb.alias}.hash`)
      .addSelect(`${qb.alias}.hit`)
      .addSelect(`${qb.alias}.world`)
      .addSelect(`${qb.alias}.map`)
      .addSelect(`${qb.alias}.difficulty`)
    this.initQueryBuilder({}, filter)
    const [items, total] = await qb.getManyAndCount()
    await this.applyJoin(items, extra)
    return {
      total,
      items,
    }
  }

  public create(body: EventRewardCreate): Promise<EventReward> {
    const pastWorlds = this.configService.get<number[]>('PAST_EVENT_WORLDS') || []
    if (pastWorlds.includes(body.world)) {
      throw new BadRequestException('EVENT_ENDED')
    }
    return super.create(body)
  }
}
